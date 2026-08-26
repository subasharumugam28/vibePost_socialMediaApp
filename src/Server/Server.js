import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from "multer";
import pkg from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authorize from './middleware/authorize.js';
import authenticate from './middleware/authenticate.js';

dotenv.config();
const { v2: cloudinary } = pkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({ dest: "uploads/" });


const app=express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("DB Connected")})
  .catch(err => console.log(err));
const userSchema=new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
})

const User=mongoose.model("User",userSchema)
const postSchema=new mongoose.Schema
({
    image:{
        type:String,
    required: true
    },
    text:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    required: true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }],
    comments:[{
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:User
},
text:String,
createdAt:{
    type:Date,
    default:Date.now
}
    }]

},{timestamps:true})

const Post=mongoose.model("Post",postSchema)
app.get("/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        message:"server is awake"
    })
})
app.post("/signup",async (req,res)=>{
    try{
        console.log("body",req.body)
    const {name,username,password,role}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword);
    const existing=await User.findOne({username});
    if(existing){
        return res.status(400).json({message:"username already exists"})
    }
const user = await User.create({
    name,
    username,
    password: hashedPassword,
    role: role
});
    const token=jwt.sign({
        id:user.id,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:"1h",
        
    })

res.json({
    message: "user created",
    user,
    token
});  
    }
  catch(err){
  console.log("ERROR:", err);
  res.status(500).json({message:"server error"});
}
})
app.post("/login",async (req,res)=>{
    const {username,password,role}=req.body;

    let user=await User.findOne({username});
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
        const valid=await bcrypt.compare(req.body.password,user.password)

    if(!valid){
        return res.status(401).json({message:"invalid password"})
    }
    const token=jwt.sign({
        id:user.id,
        role:user.role
    },process.env.JWT_SECRET,{expiresIn:"1h",
        
    })

    res.json({message:"user exists",user,token})
 
})

app.post("/upload",authenticate,upload.single("image"),async (req,res)=>{
    try{

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
 const result = await cloudinary.uploader.upload(req.file.path);
     fs.unlink(req.file.path, (err) => {
      if (err) console.log("File delete error:", err);
      else console.log("Local file deleted");
    });
    console.log("result", result);

    console.log("CLOUD URL:", result.secure_url);

    res.json({ imageUrl: result.secure_url });

}
    catch(err){
        console.log("err",err)
    }
})
app.post("/post",authenticate,async (req,res)=>{
    try{
const {image,text}=req.body;
const post =await Post.create({image,text,userId:req.user.id});
res.json(post)
    }
    catch(err){
        console.log(err)
    }
})

app.get("/posts",authenticate,async (req,res)=>{
    try{
    const posts=await Post.find().sort({createdAt:-1}).populate("userId","name");
    res.json(posts);}
    catch(err){
console.log(err)
    }
})

app.get("/mypost/:userid", authenticate,async (req, res) => {
  try {
    const userId = req.params.userid;

    const mypost = await Post.find({ userId }).populate("userId","name");

    res.json(mypost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/updatepost/:id",async(req,res)=>{
try{
    const _id=req.params.id;
    const updatedPost=await Post.findByIdAndUpdate(_id,{text:req.body.text},{new:true})
    res.json(updatedPost);
}
catch(err){
   res.status(500).json({ message: "Error updating post" });
}    
})
app.put("/likepost/:postid",async (req,res)=>{
    try{
    const _id =req.params.postid;
    const post=await Post.findById(_id);
    const userid=req.body.userid;
    const likedpost = post.likes.some(
  (id) => id.toString() === userid
);
    if(!likedpost){
        post.likes.push(userid)
    }
    else{
        post.likes=post.likes.filter((id)=>id.toString()!==userid)
    }
post.save();
res.json(post);
    }
    catch(err){
console.log(err)
    }
})
app.delete("/deletepost/:id",async (req,res)=>{
    try{
        console.log(req.params.id)
        const _id=req.params.id;
const deletedPost=await Post.findByIdAndDelete({_id});
res.json(deletedPost);
    }
    catch(err){
console.log(err)
    }
})
app.get("/", (req,res)=> res.send("API running"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

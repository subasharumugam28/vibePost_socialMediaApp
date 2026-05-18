import '../Styles/MyPost.css';

import IconButton from '@mui/material/IconButton';

import { useEffect, useState } from 'react';
import api from "../Api/Axios";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
function MyPost() {
  const [myPost, setMyPost] = useState([]);
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
const deletePost = async (id) => {
    try {
      await api.delete(`deletepost/${id}`);

      setMyPost((prev) =>
        prev.filter((post) => post._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };
   
const postLike=(async (data)=>{
  try{
  const id=data._id;
  const userid=localStorage.getItem("userId");
  const response=await api.put(`likepost/${id}`,  { userid })
     setMyPost((prevPosts) =>
      prevPosts.map((post) =>
        post._id === id ? response.data : post
      )
    );
  }
    catch(err){
      console.log(err);
    }
})
  
  const  EditPost=async ( data)=>{console.log(data)
    console.log("edit front",data)
    navigate("/editpost",{state:{data}})
   
  }

  
  useEffect(() => {
  
   const fetchPosts = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await api.get(`mypost/${userId}`);

      setMyPost(res.data);
 }catch(err){
console.log(err)
 } 
finally {
      setLoading(false);
    }
}
 fetchPosts();
}, []);
if(loading) {
  return <h1  style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        fontSize: "clamp(18px, 5vw, 28px)",
      }}>LOADING...</h1>}
else{
  return (
    <>
      <div className='homepage'>
        <div className='homepagemain'>

          {myPost?.map((post) => (
            <div key={post._id} className='homepagesub'>
   


              <div className="image-box">
                <img
                  className='homepageimg'
                  src={post.image}
                  alt="post"
                  loading="lazy"
                />
              </div>
            <div className='post-header'>
              <h3 className="title">
                {post.text || "No caption"}
              <IconButton onClick={()=>{EditPost(post)}} style={{display:"inline"}}>

        <EditIcon style={{display:"inline"}} />

</IconButton>
   <IconButton onClick={()=>{deletePost(post._id)}} >
        <DeleteIcon />

</IconButton>
              </h3>
             
</div>
                  <p className="price" onClick={() => postLike(post)}>
        <span
          
        >
          
  {post.likes?.includes(localStorage.getItem("userId")) ? "❤️" : "🤍"}
        </span>

        {" "}
        {post.likes?.length || 0} Likes

      </p>

            </div>
          ))}

        </div>
      </div>
    </>
  );
}
}
export default MyPost;
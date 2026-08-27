import '../Styles/Homepage.css';
import IconButton from '@mui/material/IconButton';

import { useCallback, useEffect, useState } from 'react';
import api from "../Api/Axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
const gettRoleFromToken=()=>{
const token=localStorage.getItem("token");
if(!token){
  return null
}
return JSON.parse(atob(token.split(".")[1]))

}
function HomePage() {
  const navigate=useNavigate();
  const role=gettRoleFromToken();
  const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, []);
const deletePost = async (id) => {
    try {
      await api.delete(`deletepost/${id}`);

      setPosts((prev) =>
        prev.filter((post) => post._id !== id)
      );

    } catch (err) {
      console.log(err);
    }
  };
    const  EditPost=async ( data)=>{console.log(data)
    console.log("edit front",data)
    navigate("/editpost",{state:{data}})
   
  }

const postLike=(  useCallback( async (data)=>{
  try{
  const id=data._id;
  const userid=localStorage.getItem("userId");
  const response=await api.put(`likepost/${id}`,  { userid })
     setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === id ? response.data : post
      )
    );
  }
    catch(err){
      console.log(err);
    }
},[]))
if(loading) {
  return <h1  style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        fontSize: "clamp(18px, 5vw, 28px)",
      }}>
        <Box sx={{ display: 'flex' }}>
      <CircularProgress size={"55px"} aria-label="Loading…" />
    </Box>
        </h1>}
else{
  return (
    <>

      <div className='homepage'>
        <div className='homepagemain'>

          {posts?.map((post) => (
            
            <div key={post._id} className='homepagesub'>

              {/* IMAGE BOX */}
              <div className="image-box">
                <img
                  className='homepageimg'
                  src={post.image}
                  alt="post"
                  loading="lazy"
                />
              </div>

              <h3 className="title">
                
                {post.text || "No caption"}
                {role.role==="admin" &&(<> 
                 <IconButton onClick={()=>{EditPost(post)}} style={{display:"inline"}}>

        <EditIcon style={{display:"inline"}} />

</IconButton>
   <IconButton onClick={()=>{deletePost(post._id)}} >
        <DeleteIcon />

</IconButton>
</>)}
              </h3>
        
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
}}

export default HomePage;
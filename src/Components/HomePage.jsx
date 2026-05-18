import '../Styles/Homepage.css';

import { useCallback, useEffect, useState } from 'react';
import api from "../Api/Axios";


function HomePage() {
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
      }}>LOADING...</h1>}
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
import{ useCallback, useEffect, useState } from "react";
import api from "../Api/Axios";
import '../Styles/Post.css'

import { useNavigate } from "react-router-dom";
function Post(){
      const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    const [posted,setPosted]=useState(false);
    const [preview, setPreview] = useState("");
  useEffect(() => {
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  setPreview(objectUrl);

  return () => URL.revokeObjectURL(objectUrl);
}, [file]);
  const handleSubmit =useCallback( async (e) => {
    console.log(localStorage.getItem("userId"))
    console.log(file)
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", file);
      setPosted(true)

      const uploadRes = await api.post(
        "upload",
        formData
      );

      const imageUrl = uploadRes.data.imageUrl;
      console.log(imageUrl)

      await api.post("post", {
        image: imageUrl,
        text: text,
        userId: localStorage.getItem("userId")
      }).then((res) => { navigate("/homepage");
    })
    .catch((err) => {
      console.error(err);
    });

    //   alert("Post created ✅");

    } catch (err) {
      console.log(err);
    }
  },[file, text, navigate]);
if(posted) {
  return <h1  style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
        fontSize: "clamp(18px, 5vw, 28px)",
      }}>UPLOADING, PLEASE WAIT IT TAKE A WHILE, DON'T REFRESH THE PAGE.</h1>}
else{return <> 


<form onSubmit={handleSubmit}>
     <div className="post-wrapper">
      <div className="post-card">

        <h2 className="title">Create Post</h2>

        <label className="upload-box">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          <span>Click to upload image</span>
        </label>

        {file && (
          <div className="image-preview">
            <img
              src={preview}
              alt="preview"
              loading="lazy"
            />
          </div>
        )}

        <textarea
          placeholder="Write a caption..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="caption"
        />

        <button className="submit-btn">Post</button>

      </div>
    </div>
    </form>
</>}
}
export default Post
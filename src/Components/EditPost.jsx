import  {  useState } from "react";
import api from "../Api/Axios";
import '../Styles/Post.css'
import { useLocation} from'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
function EditPost(){
      const navigate = useNavigate();
    const location=useLocation();
    const [id]=useState(location.state.data?._id||"")
    const [text, setText] = useState(location.state.data?.text || "");

  const handleSubmit = useCallback(async (e) => {
    
    e.preventDefault();

    try {
   console.log(id,text)

      const updateRes = await api.put(
        `updatepost/${id}`,
        {text}
      ).then(()=>{navigate("/mypost")});

    updateRes();


    } catch (err) {
      console.log(err);
    }
  },[id,text,navigate]);

return <>
<form onSubmit={handleSubmit}>
     <div className="post-wrapper">
      <div className="post-card">

        <h2 className="title">Edit Post</h2>


 
          <div className="image-preview">
            <img
              src={location.state.data.image}
              alt="preview"
              loading="lazy"
            />
          </div>
        

        <textarea
          placeholder="Write a caption..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="caption"
        />

        <button className="submit-btn">Update Post</button>

      </div>
    </div>
    </form>
</>
}
export default EditPost
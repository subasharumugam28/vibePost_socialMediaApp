import '../Styles/Login.css'
import img from '../Assests/Gemini_Generated_Image_oqrr4aoqrr4aoqrr.png';
import { Link } from 'react-router-dom';
import {useFormik} from 'formik'
import * as yup from 'yup'
import api from "../Api/Axios";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Login(){
    const navigate=useNavigate();
      const [loading, setLoading] = useState(false);
      const [InvalidUsername,setInvalidUsername]=useState("");
    const formik=useFormik({
        initialValues:{
            username:"",
            password:""
        },
        validationSchema:yup.object({
            username:yup.string().min(6,"too short").required("please enter username"),
            password:yup.string().min(6,"please enter valid password").required("please enter password")
        }),
        onSubmit:async (value)=>{
            try{
                   setLoading(true);
const {username,password}=value;
api.post("login",{username,password}).then((res) => 
    {
     
        navigate("/homepage")
        
    const id=res.data.user._id
    localStorage.setItem("userId",id)

})
    
  .catch(err => {
    setLoading(false);
       setInvalidUsername(err.response.data.message);
    console.log(err.response?.data?.message);
  });

            }
            catch(err){
               if (err.response) {
    console.log(err.response.data.message);
  } else {
    console.log("Network error");
  }
            }
        }
    })

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
    return(
            <form onSubmit={formik.handleSubmit}>

        <div className='page'>
        <div className="main">
            <div className='sub'><img className='img' src={img} alt="User login illustration" loading="lazy"></img></div>
            <div className="sub"><input type='text' autoComplete='on' placeholder='USERNAME'{...formik.getFieldProps("username")}  />{formik.touched.username && formik.errors.username && <span>{formik.errors.username}</span>}</div>
            <div className="sub"><input type='password' placeholder='PASSWORD' {...formik.getFieldProps("password")} />{formik.touched.password && formik.errors.password && <span>{formik.errors.password}</span>}</div>
            <div className='sub'><button type="submit" className="button">
  LOGIN
</button>
{InvalidUsername && <h3>{InvalidUsername}</h3>}
</div>       
                   <div className='sub'><Link to="/">GO TO SIGNUP PAGE</Link></div>
                   
                   </div>
                   </div>
                   </form>

    )}
}

export default Login
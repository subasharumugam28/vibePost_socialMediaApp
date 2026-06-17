import '../Styles/SignUp.css';
import img from '../Assests/Gemini_Generated_Image_oqrr4aoqrr4aoqrr.png';
import { Link } from 'react-router-dom';
import {useFormik} from 'formik'
import * as yup from 'yup'
import api from "../Api/Axios";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Signup() {
    const [usernameAlreadyExist,setUsernameAlreadyExist]=useState("");
    const navigate=useNavigate();
          const [loading, setLoading] = useState(false);
    const formik =useFormik({
    initialValues:{
        name:"",
        username:"",
        password:"",
        confirmpassword:""
    },

    validationSchema:yup.object({
    name:yup.string().min(3,"too short").required("please enter name"),
    username:yup.string().min(3,"too short").required("please enter username"),
    password:yup.string().min(6,"minimum six character required").required("plese enter password"),
    confirmpassword:yup.string().oneOf([yup.ref("password")], "Passwords must match").required("please enter confirm password")

}),
onSubmit:async (values)=>{
    try{
        setLoading(true);
    const {confirmpassword,...data}=values;
const res=await api.post( "signup",data).then((res)=>
    {navigate("/homepage")    
    const id=res.data.user._id
    localStorage.setItem("userId",id)
})
console.log(data)
console.log(res.data)
    console.log(values)}
  catch(error){
   if (error.response?.status === 400)
    setLoading(false);
{    setUsernameAlreadyExist(error.response.data.message);
  console.log(error.response.data.message)}
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
    return (
        
                <form onSubmit={formik.handleSubmit} noValidate>

        <div className="page">
            <div className="main">
               
                <div className='sub'>
                    <img className='img' src={img} alt="Company Logo" loading="lazy"/>
                </div>
                <div className="sub">
                    <input type='text' placeholder='FULL NAME' aria-label="Full Name" {...formik.getFieldProps("name")}/>
                    {formik.touched.name && formik.errors.name &&  <span>{ formik.errors.name}</span>}
                </div>
                <div className="sub">
                    <input type='text' placeholder='USERNAME' aria-label="USERNAME" {...formik.getFieldProps("username")}/>
                    {formik.touched.username&&formik.errors.username&&<span>{formik.errors.username}</span>}
                </div>
                <div className="sub">
                    <input type='password' placeholder='PASSWORD' aria-label="Password" {...formik.getFieldProps("password")}/>
                {formik.touched.password&&formik.errors.password&&<span>{formik.errors.password}</span>}
                </div>
                <div className="sub">
                    <input type='password' placeholder='CONFIRM PASSWORD' aria-label="Confirm Password" {...formik.getFieldProps("confirmpassword")}/>
                {formik.touched.confirmpassword&&formik.errors.confirmpassword&&<span>{formik.errors.confirmpassword}</span>}
                </div> 
                <div className='sub'>
                  <button className="button" type="submit">
  SIGN UP
</button>
{usernameAlreadyExist && <h3>{usernameAlreadyExist}</h3>}
                </div>       
                <div className='sub'>
                    <Link to="/login">GO TO LOGIN PAGE</Link>
                </div>
            </div>
        </div>
                </form>

    );}
}

export default Signup;
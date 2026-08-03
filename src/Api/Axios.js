import axios from "axios";

const api=axios.create({
    baseURL:"https://vibepost-socialmediaapp-2.onrender.com",
    //    baseURL: "http://localhost:5000"
    // timeout:10000,
},
)
api.interceptors.request.use((config)=>{
const token=localStorage.getItem("token")
   
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config;
})
export default api
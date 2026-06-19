import axios from "axios";
const api=axios.create({
    baseURL:"https://vibepost-socialmediaapp-2.onrender.com",
    // timeout:10000,
})
export default api
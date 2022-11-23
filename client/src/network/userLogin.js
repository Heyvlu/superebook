import axios from 'axios';
import host from "./const";

const userLogin=async (userName,password)=>{
    const res=await axios.post(`${host}/login`,{userName,password});
    return res;
}

export default userLogin;
import axios from 'axios';
import host from "./const";

const userRegister=async (userName,password)=>{
    const res=await axios.post(`${host}/register`,{userName,password});
    return res;
}

export default userRegister;
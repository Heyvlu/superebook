import axios from 'axios';
import host from "./const";

const jwtAuthentication=async (jwtTokenString)=>{
    const res=await axios.post(`${host}/authentication`,{jwtTokenString});
    return res;
}

export default jwtAuthentication;
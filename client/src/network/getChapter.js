import axios from 'axios';
import host from "./const";

const getChapter=async(url)=>{
    const res=await axios.get(`${host}/chapter`, { params: { url } });
    return res;
}

export default getChapter;
import axios from 'axios';
import host from "./const";

const getCatalogue=async (novelUrl)=>{
    const res=axios.get(`${host}/catalogue`,{params: { url: novelUrl}});
    return res;
}

export default getCatalogue;
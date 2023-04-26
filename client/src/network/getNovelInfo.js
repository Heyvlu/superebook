import axios from 'axios';
import host from "./const";

const getNovelInfo=async(novelName)=>{
    const res=await axios.get(`${host}/home`,{params: { url:JSON.stringify({
                url:"https://www.ibiquges.com/modules/article/waps.php",
                method:"POST",
                data:{searchkey:novelName}
            }) }});
    return res;
}

export default getNovelInfo;
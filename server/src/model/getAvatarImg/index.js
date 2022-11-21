const fs=require('fs').promises;

async function getAvatarImg(path){
    return await fs.readFile(path);
}

module.exports=getAvatarImg;
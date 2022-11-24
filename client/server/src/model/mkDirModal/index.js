const fs=require('fs');

function mkdir(folder){
    try{
        //测试path指定的文件或目录的用户权限，我们用来检测文件是否存在
        fs.accessSync(folder);
    }catch(e){
        //文件夹不存在，以同步的方式创建文件目录
        fs.mkdirSync(folder);
    }
}

module.exports=mkdir;
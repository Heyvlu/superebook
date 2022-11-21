const multer=require('koa-multer');

let storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"../uploadImgs/");
    },
    filename:function (req,file,cb){
        let fileFormat=(file.originalname).split('.');
        cb(null,Date.now()+"-"+file.originalname);
    }
})

let upload=multer({storage});

module.exports=upload;

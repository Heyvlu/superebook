const UserModel = require("./UserModel");
const upload=require('./uploadImgModal');
const mkdir=require('./mkDirModal');



const models = {

}


const init = async ()=>{
    const userModel = new UserModel();
    await userModel.init();
    await mkdir('../uploadImgs/');
    models.userModel = userModel;
    models.upload = upload;
}

module.exports = {
    models,
    init
}
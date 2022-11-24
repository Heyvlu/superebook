const jwt=require('jsonwebtoken'); //导入用于生成JWT字符串的包
const {createHmac}=require('crypto');
const {models} = require("./model");


// 秘钥
const secretKey='CoderHe';
//token
const hash=(data)=>{
    return createHmac('sha256',secretKey).update(data+'qwer').digest('hex');
}
//jwtToken
function jwtToken(payload){
    return jwt.sign(payload,'jwtCoder',{expiresIn: '4day'});
}

//注册
async function register(obj){
    const token=hash(obj.password);
    return await models.userModel.addUser(obj.userName,token);
}
//登录
async function login(obj){
    const token=hash(obj.password);
    const res=await models.userModel.findUser(obj.userName);
    const jwtTokenString=jwtToken({userName:obj.userName,data:token});
    if(res!==undefined && res!==null && res.dataValues.token===token){
        console.log('登录成功');
        return {flag:true,jwt:jwtTokenString,path:res.dataValues.avatarPath};
    }else{
        console.log('登录失败')
        return {flag:false};
    }
}
//jwt鉴权
async function jwtAuthentication(obj){
    console.log('进行jwt鉴权');
    const resObj=jwt.verify(obj.jwtTokenString,'jwtCoder',async function (err,decoded){
        if(err){
            console.log(err.message);
            return {flag:false};
        }else{
            const res=await models.userModel.findUser(decoded.userName);
            if(res!==undefined && res!==null && res.dataValues.token===decoded.data){
                return {flag:true,userName:decoded.userName,path:res.dataValues.avatarPath};
            }else{
                return {flag:false};
            }
        }
    })
    return resObj;
}

module.exports = {login,register,jwtAuthentication}
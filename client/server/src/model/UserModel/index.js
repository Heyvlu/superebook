const {Sequelize,DataTypes} = require('sequelize');

const sequelize=new Sequelize('my_db','root','123456youcando',{
    host:'localhost',
    dialect:'mysql'
})
try{
    sequelize.authenticate().then(()=>{
        console.log('连接服务器成功');
    })
}catch(err){
    console.log('连接服务器失败',err);
}


class UserModel{
    constructor() {
        this.db = sequelize.define('Users',{
            id:{
                type:DataTypes.INET,
                autoIncrement:true,
                primaryKey:true
            },
            userName:{
                type:DataTypes.STRING,
                allowNull:false
            },
            token:{
                type:DataTypes.STRING,
                allowNull: false
            },
            avatarPath:{
                type:DataTypes.STRING,
                allowNull:true
            }
        })
    }

    init = async ()=>{
        await sequelize.sync({alter:true});
    }

    addUser = async (userName,token)=>{
        const users=await this.db.findAll({
            where:{
                userName:userName
            }
        })
        if(users.length===0){
            const res=await this.db.create({userName,token});
            if(res!==undefined && res!==null){
                console.log('注册成功');
                return true;
            }
        }else {
            console.log('此用户名已被占用');
            return false;
        }
    }

    findUser=async (userName)=>{
        return await this.db.findOne({
            where:{
                userName:userName
            }
        })
    }

    updateAvatarPath=async (userName,path)=>{
        const res=await this.findUser(userName);
        if(res!==undefined && res!==null){
            res.avatarPath=path;
            await res.save();
            return true;
        }else{
            return false;
        }
    }
}

module.exports = UserModel;
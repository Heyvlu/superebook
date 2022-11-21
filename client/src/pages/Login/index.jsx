import React,{useRef,useState,useEffect} from "react";
import './index.scss';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import {Card, Form, Button, Toast, Avatar,Upload} from '@douyinfe/semi-ui';
import {IconUpload,IconCamera} from '@douyinfe/semi-icons';
import {setAuthentication} from "../../redux/actions/setAuthentication";

function Login(props){
    const navigate=useNavigate();
    const formRef=useRef();
    const headers={
        'enctype':"multipart/form-data"
    }
    const {setAuthentication}=props;

    const [login,setLogin]=useState(true);
    const [userName,setUserName]=useState('');
    const [loginSuccess,setLoginSuccess]=useState(false);
    const [url,setUrl]=useState('')

    useEffect(()=>{
        if(localStorage.getItem("jwtTokenString")){
            const jwtTokenString=localStorage.getItem("jwtTokenString");
            axios.post('http://localhost:8000/authentication',{jwtTokenString}).then(res=>{
                if(res.data.flag){
                    //jwt鉴权成功
                    setLoginSuccess(true);
                    setUserName(res.data.userName);
                    setUrl(`http://localhost:8000/getAvatarImg?path=${res.data.path}`);
                    setAuthentication(true);
                }
            })
        }
    },[])

    // 登录
    function handleLogin() {
        const userName=formRef.current.getValues().userName;
        const password=formRef.current.getValues().password;
        if(userName===undefined || password===undefined){
            Toast.error('请输入用户名和密码');
        }else{
            axios.post('http://localhost:8000/login',{userName,password}).then((res)=>{
                console.log('登录结果',res.data);
                if(res.data.flag===true){
                    Toast.success('登录成功!');
                    setUserName(userName);
                    setLoginSuccess(true);
                    localStorage.setItem('jwtTokenString',res.data.jwt);
                    setUrl(`http://localhost:8000/getAvatarImg?path=${res.data.path}`);
                    //全局身份认证
                    setAuthentication(true);
                }else{
                    Toast.error('登录失败，请确认你的用户名和密码正确！');
                }
            }).catch((error)=>{
                Toast.error('登录失败，请重试！');
                console.log('error',error);
            })
        }
    }
    // 注册
    function handleRegister(){
        const userName=formRef.current.getValues().userName;
        const password=formRef.current.getValues().password;
        if(userName===undefined || password===undefined){
            Toast.error('请输入用户名和密码');
        }else{
            axios.post('http://localhost:8000/register',{userName,password}).then((res)=>{
                console.log('注册结果',res.data);
                if(res.data===true){
                    Toast.success('注册成功！请登录');
                    setTimeout(()=>{
                        formRef.current.setValues({},{isOverride:true});
                        setLogin(true);
                    },500);
                }else{
                    Toast.error('注册失败，此用户名已被占用！');
                }
            }).catch((error)=>{
                Toast.error('注册失败，请重试！');
                console.log('error',error);
            })
        }
    }

    function valueChange(props){
        const userName=props.values.userName;
        const password=props.values.password;
        if(userName!==undefined){
            const reg1=/[^a-zA-Z0-9\u4e00-\u9fa5]/g;
            // 符合规则的新值
            const newUserName=userName.replace(reg1,'');
            if(reg1.test(userName)){
                Toast.error('用户名只能为汉字、大小写字母和数字');
                formRef.current.setValue('userName',newUserName,{isOverride:true});
            }
        }
        if(password!==undefined){
            const reg2 = /[^a-zA-Z0-9!@]/g;
            const newPassword=password.replace(reg2,'');
            if(reg2.test(password)){
                Toast.error('密码只能为大小写字母、数字、！和@');
                formRef.current.setValue('password',newPassword,{isOverride:true});
            }
        }
    }

    function gotoRegister(state){
        setLogin(state);
        formRef.current.setValues({},{isOverride:true});
    }

    //返回
    function goBack() {
        navigate(-1);
    }

    //退出登录
    function handleLogout(){
        setLoginSuccess(false);
        setUrl('');
        setAuthentication(false);
        localStorage.removeItem("jwtTokenString");
    }

    //更换头像
    function upImgSuccess(response,file){
        const obj={path:response.path};
        setUrl(`http://localhost:8000/getAvatarImg?path=${obj.path}`);
    }

    return(
        <div className={'login'}>
            <Button className={"backToPage"} theme='solid' type='primary' onClick={goBack}>返回</Button>
            {
                loginSuccess?
                    <Card
                        style={{ width:'600px',padding:"10px 30px"}}
                        title={
                        <div style={{fontSize:'20px',fontWeight:'600',lineHeight:"30px",textAlign:"left"}}>基本信息</div>
                        }
                        footer={
                            <div className={"logout"}>
                                <Button theme='solid' onClick={handleLogout}>退出登录</Button>
                            </div>
                        }>
                        <div className={"avatarImg"}>
                            <Upload
                                className={"avatar-upload"}
                                action={"http://localhost:8000/uploadImg"}
                                headers={headers}
                                data={{userName:userName}}
                                name={"avatar"}
                                accept={'.jpeg,.png'}
                                showUploadList={false}
                                limit={1}
                                maxSize={800}
                                onSizeError={(file, fileList)=>Toast.error(`${file.name} 尺寸超出限制！`)}
                                onSuccess={upImgSuccess}
                                onError={()=>Toast.error('上传失败!')}>
                                <Avatar size={"extra-large"} color={"red"} alt={"User"} src={url} hoverMask={<IconCamera className={"iconCamera"} size={"extra-large"}/>}>u</Avatar>
                            </Upload>
                        </div>
                        <Upload
                            action={"http://localhost:8000/uploadImg"}
                            headers={headers}
                            data={{userName:userName}}
                            name={"avatar"}
                            accept={'.jpeg,.png'}
                            showUploadList={false}
                            limit={1}
                            maxSize={800}
                            onSizeError={(file, fileList)=>Toast.error(`${file.name} 尺寸超出限制！`)}
                            onSuccess={upImgSuccess}
                            onError={()=>Toast.error('上传失败!')}
                            className={"avatarBt"}>
                            <Button size={"small"} icon={<IconUpload />}>更新头像</Button>
                        </Upload>
                        <p style={{fontSize:"10px"}}>* 支持JPEG, PNG 格式图片，图片尺寸请勿超过 800kb</p>
                        <div className={"userNameContainer"}>
                            <span className={"userNameLable"}>用户名：</span>
                            <span className={"userName"}>{userName}</span>
                        </div>
                    </Card>:
                    <Card
                        headerLine={false}
                        style={{ width:'500px',padding:"10px 30px"}}
                        title={
                            <div style={{fontSize:'25px',fontWeight:'900',lineHeight:"30px",textAlign:"left"}}>{login?'登录':'注册'}</div>
                        }
                        footer={
                            <div style={{textAlign:"left"}}>
                                {login?<><span>如果没有帐号请先</span>
                                        <Button theme='borderless' type='primary' onClick={()=>gotoRegister(false)}>注册帐号</Button></>:
                                    <><span>如果已有帐号</span>
                                        <Button theme='borderless' type='primary' onClick={()=>gotoRegister(true)}>返回登录</Button></>}
                            </div>
                        }>
                        <Form
                            labelPosition={"inset"}
                            getFormApi={formApi=>formRef.current=formApi}
                            onChange={valueChange}
                        >
                            <Form.Input
                                field={"userName"}
                                label={<div style={{width:'45px',transform:'translateX(4px)'}}>用户名</div>}
                                placeholder={"请输入用户名"}
                            ></Form.Input>
                            <Form.Input
                                field={"password"}
                                label={<div style={{width:'45px',transform:'translateX(5px)'}}>密码</div>}
                                placeholder={"请输入密码"}
                            ></Form.Input>
                            {
                                login?<Button htmlType={'submit'} theme='solid' type='primary' style={{width:'100%',marginTop:'15px'}} onClick={handleLogin}>登录</Button>:
                                    <Button htmlType={'submit'} theme='solid' type='primary' style={{width:'100%',marginTop:'15px'}} onClick={handleRegister}>注册</Button>
                            }
                        </Form>
                    </Card>
            }
        </div>
    )
}

export default connect(
    state=>({}),
    {
        setAuthentication:setAuthentication
    }
)(Login);
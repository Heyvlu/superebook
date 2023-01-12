import React, {useState, useEffect, useCallback,} from "react";
import './index.scss';
import { Input,Button,Dropdown,Modal,Avatar} from '@douyinfe/semi-ui';
import {IconSearch,IconUserCircle} from '@douyinfe/semi-icons';
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import {setConfirm} from "@/redux/actions/setConfirm";
import {setAuthentication} from "@/redux/actions/setAuthentication";
import getNovelInfo from "@/network/getNovelInfo";
import jwtAuthentication from "@/network/jwtAuthentication";
import host from "@/network/const";


function Home(props) {
    const {setConfirm,authentication,setAuthentication}=props;
    const navigate=useNavigate();
    const [toCatalogue,setToCatalogue]=useState(false);
    const [inputValue,setInputValue]=useState('大夏文圣');
    const [novelName,setNovelName]=useState();
    const [novelUrl,setNovelUrl]=useState();
    const [url,setUrl]=useState('');

    const saveInputValue=(value)=>{
        setInputValue(value);
    }
    //防抖
    const debounce=(fn,initial)=>{
        let timer=null;
        return ()=>{
            clearTimeout(timer);
            timer=setTimeout(fn,initial);
        };
    }

    const search=useCallback(debounce(()=>{
            if(inputValue===''){
                setConfirm({visible:true,title:'警告!',content:'请求出错，请重试！请确保您搜索的小说名字正确'});
            }else{
                    getNovelInfo(inputValue).then((res)=>{
                    setNovelName(res.data[0]);
                    setNovelUrl(res.data[1]);
                    setToCatalogue(!toCatalogue);
                    setInputValue('');
                }).catch((error)=>{
                    Modal.error({
                        title:'错误！',
                        content:'没有找到您想要的小说,请重试',
                        centered:true,
                        mask:true,
                        maskClosable:false
                    })
                    console.log("没有找到您想要的小说",error);
                })
            }
        }
    ,500),[inputValue])

    useEffect(()=>{
        if(novelName && novelUrl){
            // home为false之后再进行路由跳转
            navigate('/catalogue',{
                state:{novelName,novelUrl}
            })
        }
    },[novelName,novelUrl,toCatalogue]);

    useEffect(()=>{
        if(localStorage.getItem("jwtTokenString")){
            const jwtTokenString=localStorage.getItem("jwtTokenString");
            jwtAuthentication(jwtTokenString).then(res=>{
                if(res.data.flag){
                    //jwt鉴权成功
                    if(res.data.path===null){
                        setUrl('');
                    }else{
                        setUrl(`${host}/getAvatarImg?path=${res.data.path}`);
                    }
                    setAuthentication(true);
                }
            })
        }
    },[])

    //跳转登录页
    function login(){
        navigate('/login');
    }
    //进入书架
    function goToBookshelf(){
        if(authentication){
            navigate('/bookshelf');
        }else{
            Modal.warning({
                title:"您还未登录",
                content:"确定要先登录吗？",
                centered:true,
                mask:true,
                maskClosable:false,
                onOk:login
            })
        }
    }
    return (
        <div className="Home">
            <Dropdown
                trigger={"click"}
                position={"bottom"}
                clickToHide={true}
                render={
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={login}>{localStorage.getItem("jwtTokenString")?'个人信息':'登录'}</Dropdown.Item>
                        <Dropdown.Item onClick={goToBookshelf}>我的书架</Dropdown.Item>
                    </Dropdown.Menu>
                }>{
                localStorage.getItem("jwtTokenString") ?
                    <Avatar size="small" color="red" className={"user"} src={url} alt={"User"}>u</Avatar>:
                    <IconUserCircle size={"extra-large"} className={"user"}/>
            }</Dropdown>
            <h3>本网站旨在建造一个<span style={{fontSize:"25px"}}>没有广告</span>的便捷电子书网站，轻松您的阅读之旅</h3>
            <Input showClear
                   className={"semiInput"}
                   placeholder={"请从下面网站中选出你喜欢的小说，复制小说名到搜索框中，然后点击搜索"}
                   suffix={<Button className={"searchButton"} theme='solid' type='primary' onClick={search}>搜&nbsp;&nbsp;索</Button>}
                   onChange={(value)=>saveInputValue(value)}
                   value={inputValue}
            ></Input>
            <div className='openWebsite' onClick={()=>{
                window.open('https://www.xbiquge.la');
            }}><IconSearch />小说网站(请从此网站选择你想要的小说)</div>
        </div>
    );
}

export default connect(
    state=>({
        authentication:state.authentication
    }),
    {
        setConfirm:setConfirm,
        setAuthentication:setAuthentication
    }
)(Home);
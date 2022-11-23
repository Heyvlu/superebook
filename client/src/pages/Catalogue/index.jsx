import React,{useEffect,useState} from 'react';
import {Button,Toast,Modal,BackTop} from '@douyinfe/semi-ui';
import {IconBookmarkAddStroked,IconBookStroked,IconArrowUp} from '@douyinfe/semi-icons';
import {NavLink,useLocation,useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import './index.scss';
import Loading from "../../components/Loading";
import {setScrollTop} from "../../redux/actions/setScrollTop";
import getCatalogue from "../../network/getCatalogue";

let readProgress=[];
// 小说目录页
function Catalogue(props) {
    let {scrollTop,setScrollTop,authentication}=props;
    const navigate=useNavigate();
    // catalogue小说目录
    const [catalogue,setCatalogue]=useState({});
    // 小说图片
    const [novelImg,setNovelImg]=useState();
    const [loading,setLoading]=useState(true);
    const {state:{novelName,novelUrl}}=useLocation();
    // console.log("novel",novelName,novelUrl);

    useEffect(()=>{
        getCatalogue(novelUrl).then((res)=>{
            setCatalogue({...res.data[0]});
            setNovelImg(res.data[1]);
            setLoading(false);
        }).catch(()=>{
            Modal.error({
                title:'错误！',
                content:'请求出错请重试',
                centered:true,
                mask:true,
                maskClosable:false,
                onOk:()=>{
                    navigate('/home',{replace:true});
                }
            })
        })
    },[novelUrl,novelName]);

    useEffect(()=>{
        // debugger
       window.addEventListener("scroll",()=>{});
       const arr=JSON.parse(localStorage.readProgress);
        const res=arr.find((item)=>{
            return item.novelName===novelName;
        })
       if(res!==undefined){
           readProgress=res.title;
       }
        return ()=>{
           window.removeEventListener("scroll",()=>{});
        }
    },[])

    useEffect(()=>{
        document.documentElement.scrollTop=scrollTop;
    },[loading])

    // 保存滚动高度和阅读进度
    function handleChapter(title){
        setScrollTop(document.documentElement.scrollTop);

        let readProArr=JSON.parse(localStorage.readProgress ?? "[]");
        const res=readProArr.find((item)=>{
            return item.novelName===novelName;
        })
        if(res===undefined){
            localStorage.readProgress=JSON.stringify([...readProArr,{novelName,title:[title]}]);
        }else{
            const titleRes=res.title.find(item=>{
                return item===title;
            })
            if(titleRes===undefined){
                res.title.push(title);
                localStorage.readProgress=JSON.stringify(readProArr);
            }
        }
    }
    // 返回首页
    function backHome(){
        setNovelImg();
        setCatalogue({});
        setScrollTop(0);
        navigate('/home',{replace:true});
    }
    // 加入书架
    function addToBookshelf(){
        if(authentication){
            let bookArr=JSON.parse(localStorage.bookshelf ?? '[]');
            const res =bookArr.find(item=>{
                return item.novelName===novelName;
            })
            if(res===undefined){
                localStorage.bookshelf=JSON.stringify([...bookArr,{novelName,novelUrl,novelImg}]);
                Toast.success("加入书架成功！")
            }else{
                Toast.error("此小说已加入书架！");
            }
        }else{
            Modal.warning({
                title:"您还未登录",
                content:"确定要先登录吗？",
                centered:true,
                mask:true,
                maskClosable:false,
                onOk:()=>{navigate('/login')}
            })
        }
    }
    // 进入我的书架
    function goToBookshelf(){
        if(authentication){
            //jwt鉴权成功
            setCatalogue('');
            setScrollTop(0);
            navigate('/bookshelf');
        }else{
            Modal.warning({
                title:"您还未登录",
                content:"确定要先登录吗？",
                centered:true,
                mask:true,
                maskClosable:false,
                onOk:()=>{navigate('/login')}
            })
        }
    }

    return(
        <div>
            {
                loading?<Loading/>: <>
                    <Button className={"backToPage"} theme='solid' type='primary' onClick={backHome}>返回首页</Button>
                    <div style={{fontSize:"28px",paddingBottom:"14px",paddingTop:"10px",paddingLeft:"7%"}}>
                        <span>{"《"}{novelName}{"》"}</span>&nbsp;
                        <Button onClick={addToBookshelf}><IconBookmarkAddStroked style={{transform:"translateY(3px)"}}/>加入书架</Button>&nbsp;&nbsp;
                        <Button onClick={goToBookshelf}><IconBookStroked style={{transform:"translateY(2px)"}}/>我的书架</Button>
                    </div>
                    <div className={"catalogueContainer"}>
                        {
                            Object.entries(catalogue).map((item)=>{
                                const read =Boolean( readProgress.find(title=>title===item[0]));
                                return(
                                    <span className={"catalogueSpan"}
                                          key={item[1]}>
                                        <NavLink to={'/chapter'} state={{url:item[1],title:item[0],novelName,novelUrl,novelImg}}>
                                            <span className={"catalogue"} onClick={()=>handleChapter(item[0])} style={{color:read?"rgb(0 100 250)":"black"}}>{item[0]}</span>
                                        </NavLink>
                                    </span>
                                )
                            })
                        }
                    </div>
                    <BackTop className={"backTop"}>
                        <IconArrowUp/>
                    </BackTop>
                </>
            }
        </div>
    )
}

export default connect(
    state=>({
        scrollTop:state.scrollTop,
        authentication:state.authentication
    }),
    {
        setScrollTop:setScrollTop
    }
)(Catalogue);

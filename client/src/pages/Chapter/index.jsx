import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import './index.scss';
import Loading from "../../components/Loading";
import {Button,Toast,Modal} from "@douyinfe/semi-ui";
import {IconArrowLeft,IconArrowRight,IconBookmark} from "@douyinfe/semi-icons";
// react-redux相关
import {connect} from "react-redux";
import {setConfirm} from "../../redux/actions/setConfirm";
import getChapter from "../../network/getChapter";
import getCatalogue from "../../network/getCatalogue";

// 章节详情页
function Chapter(props){
    let catalogue={};
    const {setConfirm,authentication}=props;
    const [chapter,setChapter]=useState();
    const [loading,setLoading]=useState(true);
    const {state:{url,title,novelName,novelUrl,novelImg}}=useLocation();
    const navigate=useNavigate();

    useEffect(()=>{
        getChapter(url).then((chapter)=>{
            setChapter(chapter.data);
            setLoading(false);
        }).catch(()=>{
            Modal.warning({
                title:'请求出错',
                content:'请求出错请重试！',
                centered:true,
                mask:true,
                maskClosable:false,
                onOk:()=>navigate(-1,{replace:true})
            })
        })
    },[url])

    //返回目录页
    function backCatalogue(){
        navigate('/catalogue',{
            replace:true,
            state:{novelName,novelUrl}
        });
    }
    //改变章节
    function changeChapter(param){
        getCatalogue(novelUrl).then((res)=>{
            catalogue=res.data[0];

            //查询当前小说的阅读进度
            let readProArr=JSON.parse(localStorage.readProgress ?? "[]");
            const novelRes=readProArr.find((item)=>{
                return item.novelName===novelName;
            })

            let array=Object.entries(catalogue);
            array.forEach((item,index)=>{
                if(param==="previous" && item[0]===title && index>0 && index<array.length){
                    // 上一章
                    console.log('上一章');
                    setLoading(true);
                    let newObj=array[index-1];

                    //记录上一章的阅读进度
                    const titleRes=novelRes.title.find(item=>{
                        return item===newObj[0];
                    })
                    if(titleRes===undefined){
                        novelRes.title.push(newObj[0]);
                        localStorage.readProgress=JSON.stringify(readProArr);
                    }

                    //跳转到上一章
                    navigate('/chapter',{
                        state:{
                            title:newObj[0],
                            url:newObj[1],
                            novelName,
                            novelUrl
                        }
                    });
                }else if(param==="previous" && item[0]===title && index===0){
                    setConfirm({visible:true,title:'警告!',content:'当前已是第一章'});
                }else if(param==="next" && item[0]===title && index>=0 && index<array.length-1){
                    // 下一章
                    setLoading(true);
                    let newObj=array[index+1];

                    //记录下一章的阅读进度
                    const titleRes=novelRes.title.find(item=>{
                        return item===newObj[0];
                    });
                    if(titleRes===undefined){
                        novelRes.title.push(newObj[0]);
                        localStorage.readProgress=JSON.stringify(readProArr);
                    };

                    //跳转到下一章
                    navigate('/chapter',{
                        state:{
                            title:newObj[0],
                            url:newObj[1],
                            novelName,
                            novelUrl
                        }
                    });
                }else if(param==="next" && item[0]===title && index===array.length-1){
                    setConfirm({visible:true,title:'警告!',content:'当前已是最后一章'});
                }
            });
        }).catch(()=>{
            setConfirm({visible:true,title:'警告!',content:'请求出错请重试!'});
        })
    }
    // 加入书签
    function addBookmark(){
        if(authentication){
            //jwt鉴权成功
            let bookArr=JSON.parse(localStorage.bookshelf ?? '[]');
            const res=bookArr.find((item)=>{
                return item.novelName===novelName;
            })
            if(res===undefined){
                Modal.warning({
                    title:'此小说还没加入书架',
                    content:'你确定将此小说加入书架并添加书签吗？',
                    centered:true,
                    mask:true,
                    maskClosable:false,
                    onOk:()=>{
                        localStorage.setItem('bookshelf',JSON.stringify([...bookArr,{novelName,novelUrl,novelImg,title,url}]));
                        Toast.success('加入书签成功！');
                    }
                })
            }else{
                if(res.title===title){
                    Toast.error('重复书签！')
                }else{
                    res.title=title;
                    res.url=url;
                    localStorage.bookshelf=JSON.stringify(bookArr);
                    Toast.success('加入书签成功！');
                }
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

    return (
        <div className={"chapter"}>
            {loading?<Loading/>:<>
                <Button className={"backToPage"} theme='solid' type='primary' onClick={backCatalogue}>返回目录</Button>
                <div className={"chapterTitle"}>{title}</div>
                <div className={"chapterContent"}>{chapter}</div>
                <div className={"changeChapter"}>
                    <Button theme='borderless' type="tertiary" className={"changeButton"} onClick={()=>changeChapter("previous")}><IconArrowLeft/>上一章</Button>
                    <Button style={{marginLeft:"5px",marginRight:"5px"}} onClick={addBookmark}><IconBookmark size={"small"}/>加入书签</Button>
                    <Button theme='borderless' type="tertiary" className={"changeButton"} onClick={()=>changeChapter("next")}>下一章 <IconArrowRight/></Button>
                </div>
            </>}
        </div>
    )
}

export default connect(
    state=>({
        authentication:state.authentication
    }),
    {
        setConfirm:setConfirm
    }
)(Chapter);
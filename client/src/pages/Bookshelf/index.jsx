import React from "react";
import './index.scss';
import {useNavigate,Link} from "react-router-dom";
import {Button,Modal,Toast} from '@douyinfe/semi-ui';
import {IconMore} from '@douyinfe/semi-icons';


function Bookshelf(){
    const navigate=useNavigate();
    //返回
    function goBack(){
        navigate(-1);
    }
    // 清空书架
    function clearBookshelf(){
        if(!localStorage.bookshelf){
            Toast.error("书架已经为空！");
        }else{
            Modal.warning({
                title:'清空书架',
                content:'确定要清空你的书架吗？',
                mask:true,
                maskClosable:false,
                centered:true,
                onOk:()=>{
                    localStorage.removeItem("bookshelf");
                    navigate('/bookshelf',{
                        replace:true
                    });
                }
            })
        }
    }
    // 删除小说
    function deleteBook(novelName){
        localStorage.removeItem(novelName);
        const bookArr=JSON.parse(localStorage.bookshelf);
        const newBookArr=bookArr.filter((item)=>{
            return item.novelName!==novelName;
        })
        localStorage.setItem('bookshelf',JSON.stringify(newBookArr));
        navigate('/bookshelf',{
            replace:true
        });
    }
    function getMore(novelName){
        Modal.warning({
            title:"删除小说",
            content:`你确定删除《${novelName}》吗？`,
            mark:true,
            maskClosable:false,
            centered:true,
            onOk:()=>deleteBook(novelName)
        })
    }
    return(
        <div>
            <div className="bookshelfTitle">
                <h2>我的书架<span style={{display:"inline-block",width:"35px"}}/><Button type="danger" onClick={clearBookshelf}>清空书架</Button></h2>
            </div>
            <div className={"bookshelfBack"}><Button theme='solid' type='primary' onClick={goBack}>返回</Button></div>
            {localStorage.bookshelf?(
                <div className={'bookshelf'}>
                    {
                        JSON.parse(localStorage.bookshelf).reverse().map((item)=>{
                            return <div key={item.novelName} className={"bookshelfItem"}>
                                <img alt={"小说图片"} src={item.novelImg} className={'bookImg'}/>
                                <span className={'bookTitle'}><Link to={'/catalogue'} state={{novelName:item.novelName,novelUrl:item.novelUrl}} style={{textDecoration:"none"}}>{"《"}{item.novelName}{"》"}</Link></span>
                                <span className={"bookMore"}>
                                    <IconMore style={{transform:'rotate(90deg)',cursor:"pointer"}} onClick={()=>getMore(item.novelName)}/>
                                </span>
                                {item.title ? <span className={'bookProgress'}>
                                        <Link to={"/chapter"}
                                              state={{url:item.url,title:item.title,novelName:item.novelName,novelUrl:item.novelUrl,novelImg:item.novelImg}}
                                              style={{textDecoration:"none"}}>添加的书签：{item.title}</Link>
                                    </span>:<span className={'bookProgress'}>没有添加书签</span>}
                            </div>
                        })
                    }
                </div>):<div style={{marginTop:"250px",fontSize:"20px"}}>你还没有添加小说到书架</div>}
        </div>
    )
}

export default Bookshelf;
import { useState, useEffect } from "react";
import axios from 'axios';
import Chapter from '../Chapter/index.jsx';
import './detail.css'
import { Button } from 'antd';
import Remiding from "../Remiding/remiding.jsx";
import 'antd/dist/antd.css';

let scrollTop = 0;
function Detail(props) {
  const [state, SetState] = useState();
  const [mulu, setmulu] = useState(null);
  const [muluBackup, setMuluBackup] = useState();
  const [request, setRequest] = useState('请求中...');
  const [back, setBack] = useState(null);
  const [title, setTitle] = useState(null);
  const [titleShow, setTitleShow] = useState(0);
  const [remiding, setRemiding] = useState('请求出错请重试，你必须输入正确的目录页链接！');
  const [remidingShow, setRemidingShow] = useState(0);
  const [turnChapter, setTurnChapter] = useState('');
  const calcPage = (val) => {
    // 点击下一章
    if (val[0]) {
      // console.log(muluBackup);
      Object.keys(muluBackup).forEach((key, index) => {
        if (muluBackup[key] === val[1]) {
          const i = index + 1;
          if (i >= 0 && i < Object.keys(muluBackup).length) {
            setTitle(Object.keys(muluBackup)[i]);
            setTurnChapter(muluBackup[Object.keys(muluBackup)[i]]);
            console.log(muluBackup[Object.keys(muluBackup)[i]], '下一章');
          }
        }
      });
    } else {
      // 点击上一章
      Object.keys(muluBackup).forEach((key, index) => {
        if (muluBackup[key] === val[1]) {
          const i = index - 1;
          if (i >= 0 && i < Object.keys(muluBackup).length) {
            setTurnChapter(muluBackup[Object.keys(muluBackup)[i]]);
            console.log(muluBackup[Object.keys(muluBackup)[i]], '上一章');
            axios.get('http://localhost:8000', { params: { url: turnChapter, chapter: 1 } }).then(chapter => {
              SetState(chapter);
              console.log(chapter, '000000');
            })
          }
        }
      });
    }
  }
  useEffect(() => {
    console.log(props.IpVal);
    axios.get('http://localhost:8000', { params: { url: props.IpVal } }).then((res) => {
      const { data } = res;
      // console.log(data);
      setmulu(data);
      setMuluBackup(data);
    }).catch(() => {
      setRemidingShow(1);
      setRequest(null);
    });
  }, [props.IpVal]);

  useEffect(() => {
    const scrollCallback = () => {
      // prevent set scroll variable to 0 when go to read page
      if (mulu) {
        console.log('===> setScrollTop', scrollTop, document.documentElement.scrollTop);
        scrollTop = document.documentElement.scrollTop
      }
    }
    document.addEventListener("scroll", scrollCallback)
    //unmount listener when App component unmount
    return () => document.removeEventListener('scroll', scrollCallback);

  }, [mulu])

  useEffect(() => {
    document.documentElement.scrollTop = scrollTop;
    console.log('====>test', scrollTop);
  }, [mulu]);

  useEffect(()=>{
    axios.get('http://localhost:8000', { params: { url: turnChapter, chapter: 1 } }).then(chapter => {
              SetState(chapter);
              console.log(turnChapter);
              console.log(chapter, 'detail');
            })
  },[turnChapter])
  return (
    <div>
      <div className="mulufather">
        <div className="mulu">{mulu ? Object.keys(mulu).map(key => {
          const url = mulu[key];
          return <div key={key}><Button className="muluButton" ><div className="muluButtondiv" onClick={() => {
            console.log(props);
            axios.get('http://localhost:8000', { params: { url, chapter: 1 } }).then(chapter => {
              setmulu(null);
              setRequest(null);
              setBack('返回目录');
              setTitle(key);
              SetState(chapter);
              setTitleShow(1);
              props.setSh(0);
            }).catch(() => {
              setRemiding('请求出错请重试！');
              setRemidingShow(1);
            })
          }}>{key}</div></Button></div>
        }) : <div className="request">{request}</div>}</div>
      </div>
      {back ? <button className='back' onClick={() => {
        axios.get('http://localhost:8000').then((res) => {
          const { data } = res;
          setmulu(data);
        });
        SetState(null);
        setBack(null);
        props.setSh(1);
        setTitle(null);
        setTitleShow(null);
      }}>{back}</button> : null}
      {titleShow && !request ? <div className='title'>{title}</div> : null}
      {state ? <Chapter chapter={state} calcChapter={calcPage}/> : null}
      {remidingShow ? <Remiding param={remiding} onClick={() => {
        setRemidingShow(0);
        window.location.href = "http://localhost:3000";
      }} /> : null}
    </div>
  );
}

export default Detail;
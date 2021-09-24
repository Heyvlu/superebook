import { useState, useEffect} from "react";
import axios from 'axios';
import Chapter from './Components/Chapter/index.jsx';
import './App.css'
import {Button} from 'antd';
import 'antd/dist/antd.css';

let scrollTop=0;
function App() {
  const [state, SetState] = useState(1);
  const [mulu,setmulu]=useState(null);
  const [request,setRequest]=useState('请求中...');
  const [back,setBack]=useState(null);
  const [title,setTitle]=useState(null);
  const [titleShow,setTitleShow]=useState(1);
  useEffect(()=>{
    axios.get('http://localhost:8000').then((res)=>{
      const {data}=res;
      setmulu(data);
      document.addEventListener("scroll",()=>{
        scrollTop=document.documentElement.scrollTop
      })
    });
  },[]);
  useEffect(()=>{
    document.documentElement.scrollTop=scrollTop;
      console.log(scrollTop);
  },[mulu]);
  return (
    <div className="App">
      <div className="mulufather">
        <div className="mulu">{mulu?Object.keys(mulu).map(key=>{
          const url=mulu[key];
          return <div key={key}><Button className="muluButton" ><div className="muluButtondiv" onClick={()=>{
            axios.get('http://localhost:8000',{params:{url}}).then(chapter=>{
              setmulu(null);
              setRequest(null);
              setBack('返回目录');
              setTitle(key);
              SetState(chapter);
            })
          }}>{key}</div></Button></div>
        }):<div className="request">{request}</div>}</div>
      </div>
      {back?<button className='back' onClick={()=>{
        axios.get('http://localhost:8000').then((res)=>{
          const {data}=res;
          setmulu(data);
        })
        SetState(null);
        setBack(null);
        setTitle(null);
        setTitleShow(null);
      }}>{back}</button>:null}
      {titleShow && !request?<div  className='title'>{title}</div>:null}
      <Chapter chapter={state}/>
    </div>
  );
}

export default App;

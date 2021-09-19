import { useState, useEffect,useRef } from "react";
import axios from 'axios';
import Chapter from './Components/Chapter/index.jsx';
import './App.css'
import {Button} from 'antd';
import 'antd/dist/antd.css';

function App() {
  const [state, SetState] = useState(1);
  const [mulu,setmulu]=useState(null);
  const [request,setRequest]=useState('请求中...');
  const [back,setBack]=useState(null);
  const [title,setTitle]=useState(null);
  const [titleShow,setTitleShow]=useState(1);
  const mulufatherRef=useRef();
  useEffect(()=>{
    axios.get('http://localhost:8000').then((res)=>{
      const {data}=res;
      setmulu(data);
    })
  },[])
  return (
    <div className="App">
      <div className="mulufather" ref={mulufatherRef}>
        <div className="mulu">{mulu?Object.keys(mulu).map(key=>{
          const url=mulu[key];
          console.log(mulufatherRef.scrollTop);
          return <div key={key}><Button className="muluButton" onClick={()=>{
            axios.get('http://localhost:8000',{params:{url}}).then(chapter=>{
              setmulu(null);
              setRequest(null);
              setBack('返回目录');
              setTitle(key);
              SetState(chapter);
            })
          }}>{key}</Button></div>
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

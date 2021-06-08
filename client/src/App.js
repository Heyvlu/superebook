import { useState, useEffect } from "react";
import axios from 'axios';
import Chapter from './Components/Chapter/index.jsx';
import './App.css'
function App() {
  const [state, SetState] = useState(1);
  const [mulu,setmulu]=useState(null);
  const [request,setRequest]=useState('请求中');
  const [back,setBack]=useState(null);
  const [title,setTitle]=useState(null);
  useEffect(()=>{
    axios.get('http://localhost:8000').then((res)=>{
      const {data}=res;
      setmulu(data);
    })
  },[])
  return (
    <div className="App">
      <div>{mulu?Object.keys(mulu).map(key=>{
        const url=mulu[key];
        return <div><button onClick={()=>{
          axios.get('http://localhost:8000',{params:{url}}).then(chapter=>{
            setmulu(null);
            setRequest(null);
            setBack('返回目录');
            setTitle(key);
            SetState(chapter);
          })
        }}>{key}</button></div>
      }):<div>{request}</div>}</div>
      {back?<button className='back' onClick={()=>{
        axios.get('http://localhost:8000').then((res)=>{
          const {data}=res;
          setmulu(data);
        })
        SetState(null);
        setBack(null);
        setTitle(null);
      }}>{back}</button>:null}
      <div className='title'>{title}</div>
      <Chapter chapter={state}/>
    </div>
  );
}

export default App;

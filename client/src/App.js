import { useState, useEffect } from "react";
import Sum from "./Components/Sum";
import axios from 'axios';

function App() {
  const [state, SetState] = useState(1);
  const [mulu,setmulu]=useState(null)
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
        return <div><button>{key}</button></div>
      }):'请求中'}</div>
      {state > 5 ? (
        <Sum a={1} b={state} />
      ) : 
        <>
          <div>{state}</div>
          <button
            onClick={() => {
              SetState(state + 1);
            }}
          >
            +
          </button>
        </>
      }
    </div>
  );
}

export default App;

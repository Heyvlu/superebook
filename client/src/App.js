import React from 'react';
import { useState} from "react";
import Detail from './Components/Detail/detail.jsx';
import './App.css';
import { Route, BrowserRouter as Router, Switch,Link} from "react-router-dom";
import {Button} from 'antd';
import { createBrowserHistory } from 'history';


function App() {
  const history = createBrowserHistory();
  const [state,setState]=useState(1);
  const [input,setInput]=useState('');
  const [search,setSearch]=useState(1);
  const changeSh=(val)=>{
    setSearch(val);
  }
  return (
    <div>
      <Router>
        {state?<div>
                <div className='website'>
                  <div>请从以下网站中选出你喜欢的小说，并复制目录页链接到搜索框中：</div>
                  <div className='openWebsite' onClick={()=>{
                    window.open('https://www.xbiquge.la');
                  }}>https://www.xbiquge.la</div>
                  <div className='openWebsite' onClick={()=>{
                    window.open('http://mm.faloo.com');
                  }}>http://mm.faloo.com</div>

                  <div className='openWebsite' onClick={()=>{
                    window.open('https://www.csg99.com');
                  }}>https://www.csg99.com</div>
                  <div className='openWebsite' onClick={()=>{
                    window.open('https://www.kanunu8.com');
                  }}>https://www.kanunu8.com</div>
                </div>
                <input placeholder="请输入你喜欢小说的目录页url" className="inputBorder" value={input} onChange={(e)=>{
                  setInput(e.target.value);
                }} type="text" style={{}}/>
                <span className="submitLink"><Link to="/detail" onClick={()=>{
                  setState(0);
                }}>搜索</Link></span>
              </div>:<div>
                        <Switch>
                          <Route exact path="/detail"><Detail IpVal={input} setSh={changeSh}/></Route>
                        </Switch>
                        {search?<Button className='searchBtn' onClick={()=>{
                                  setState(1);
                                  history.replace('/')
                                }}>返回搜索</Button>:null}
                      </div>}
      </Router>
    </div>
  );
}

export default App;
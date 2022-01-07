import React from 'react';
import { useState} from "react";
import Detail from './Components/Detail/detail.jsx';
import './App.css';
import { Route, BrowserRouter as Router, Switch,Link} from "react-router-dom";
import {Button} from 'antd';

function App() {
  const [state,setState]=useState(1);
  return (
    <div>
      <Router>
        {state?<div>
                <input placeholder="请输入你的目录url" className="inputBorder"/>
                <span className="submitLink"><Link to="/detail" onClick={()=>{
                  setState(0);
                }}>提交</Link></span>
              </div>:<div>
                        <Switch>
                          <Route exact path="/detail" component={Detail}/>
                        </Switch>
                        <Button className='searchBtn' onClick={()=>{
                          setState(1);

                        }}>返回搜索</Button>
                      </div>}
      </Router>
    </div>
  );
}

export default App;
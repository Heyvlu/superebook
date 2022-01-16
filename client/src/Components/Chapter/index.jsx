import React from "react";
import './index.css';
const Chapter=(props) => {
  if(props.chapter && props.chapter.data){
    const one=props.chapter.data.split('\n');
    return <div className="paragraphF">{one.map((paragraph,index)=>{
      return <div key={index} className="paragraph">{paragraph}<br/></div>
    })}</div>
  }else {
    return null;
  }
};


export default Chapter;

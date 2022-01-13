import React from "react";
import './index.css';
const Chapter=(props) => {
  if(props.chapter && props.chapter.data){
    const one=props.chapter.data.split('\n');
    return one.map((paragraph,index)=>{
      return <div key={index} className="paragraph">{paragraph}<br/></div>
    })
  }else {
    return null;
  }
};


export default Chapter;

import React from "react";
import './index.css'
const Chapter=(props) => {
  if(props.chapter && props.chapter.data){
    const one=props.chapter.data.split('\n');
    console.log(props.chapter);
    return one.map((paragraph)=>{
      return <div key={paragraph} className="paragraph">{paragraph}<br/></div>
    })
  }else {
    return null;
  }
};


export default Chapter;

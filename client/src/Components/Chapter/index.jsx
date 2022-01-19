import React from "react";
import './index.css';
const Chapter = (props) => {
  if (props.chapter && props.chapter.data) {
    console.log(props,'chapter');
    // console.log(props.chapter.config.params.url);
    const one = props.chapter.data.split('\n');
    return <div className="paragraphF">{one.map((paragraph, index) => {
      return <div key={index} className="paragraph">{paragraph}<br /></div>
    })}
      <div className="turnPage">
        <span className="pageUp" onClick={() => {
          props.calcChapter([0, props.chapter.config.params.url]);
        }}>上一章</span>
        <span className="pageDown" onClick={() => {
          props.calcChapter([1, props.chapter.config.params.url]);
        }}>下一章</span>
      </div>
    </div>
  } else {
    return null;
  }
};


export default Chapter;

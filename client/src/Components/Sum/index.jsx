import React from "react";
import './index.css'
const Sum=(props) => {
  const { a, b } = props;
  return <div className='result'>{a + b}</div>;
};


export default Sum;

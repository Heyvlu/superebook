import './remiding.css';
import {Button} from 'antd';

const Remiding=(props)=>{
    console.log(props);
    return (<div className="remiding">
                <div>{props.param}</div>
                <Button className='remidingBtn' onClick={props.onClick}>确定</Button>
            </div>)
}

export default Remiding;
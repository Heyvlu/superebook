import { Modal } from '@douyinfe/semi-ui';
import {IconAlertTriangle} from '@douyinfe/semi-icons';
import {connect} from "react-redux";
import {setConfirm} from "../../redux/actions/setConfirm";

//  模态对话框
function Confirm(props){
    let {confirm,setConfirm}=props;
    function handleOk(){
        setConfirm({visible:false,title:'',content:''});
    }

    return(
        <>
            <Modal
                title={confirm.title}
                visible={confirm.visible}
                centered={true}
                hasCancel={true}
                mask={true}
                maskClosable={false}
                icon={<IconAlertTriangle size={"extra-large"} style={{ color: 'var(--semi-color-warning)' }}/>}
                onOk={handleOk}
                onCancel={handleOk}
                style={{fontSize:'16px'}}
            >{confirm.content}</Modal>
        </>
    )
}

export default connect(
    state=>({confirm:state.confirm}),
    {
        setConfirm:setConfirm
    }
)(Confirm);
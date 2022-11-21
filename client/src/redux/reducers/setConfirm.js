export function setConfirmReducer(preState={visible:false,title:'',content:''},action){
    const {type,data}=action;
    switch (type) {
        case "setConfirm":
            return data;
        default:
            return preState;
    }
}
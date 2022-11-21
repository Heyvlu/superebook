export function setScrollTopReducer(preState=0,action){
    const {type,data}=action;
    switch (type){
        case "setScrollTop":
            return data;
        default:
            return preState;
    }
}
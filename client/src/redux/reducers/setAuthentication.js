export function setAuthenticationReducer(preState=false,action){
    const {type,data}=action;
    switch (type){
        case 'setAuthentication':
            return data;
        default:
            return preState;
    }
}
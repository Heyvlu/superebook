import {combineReducers} from 'redux';
import {setConfirmReducer} from "./setConfirm";
import {setScrollTopReducer} from "./setScrollTop";
import {setAuthenticationReducer} from "./setAuthentication";

export default combineReducers({
    confirm:setConfirmReducer,
    scrollTop:setScrollTopReducer,
    authentication:setAuthenticationReducer
});

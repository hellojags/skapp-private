import { ACT_TY_CHANGE_DARK_MODE_STATE } from "../reducers/actions/sn.action.constants";
import { STORAGE_DARK_MODE_KEY } from "../sn.constants";

export default (state, action)=> {
   
    switch(action.type){
        case ACT_TY_CHANGE_DARK_MODE_STATE:
            return action.payload;
        default:
            if (state==null) {
                const storedDarkMode = localStorage.getItem(STORAGE_DARK_MODE_KEY);
                state = storedDarkMode && JSON.parse(storedDarkMode);
            }
            return state;
    }
}
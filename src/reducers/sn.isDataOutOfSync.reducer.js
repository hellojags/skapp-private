import { ACT_TY_SET_DATA_SYNC_STATUS } from "./actions/sn.action.constants";
import { STORAGE_USER_KEY, BROWSER_STORAGE } from "../sn.constants";

export default (state = false, action) => {
    switch(action.type){
        case ACT_TY_SET_DATA_SYNC_STATUS:
            return action.payload;
        default:
            return state;
    }
}
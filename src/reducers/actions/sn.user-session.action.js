import { BROWSER_STORAGE, STORAGE_USER_SESSION_KEY, ID_PROVIDER_SKYID} from "../../sn.constants";
import { ACT_TY_SET_USER_SESSION } from "./sn.action.constants";

export const setUserSession = (userSession) => {
    if (userSession == null) {
        BROWSER_STORAGE.removeItem(STORAGE_USER_SESSION_KEY);
      } else if (userSession.skydbseed) {
        BROWSER_STORAGE.setItem(STORAGE_USER_SESSION_KEY, JSON.stringify(userSession));
      }else if (userSession.idp == ID_PROVIDER_SKYID) {
        BROWSER_STORAGE.setItem(STORAGE_USER_SESSION_KEY, JSON.stringify(userSession));
        //BROWSER_STORAGE.setItem(STORAGE_USER_SESSION_KEY, userSession);
      }
    return {
        type: ACT_TY_SET_USER_SESSION,
        payload: userSession
    };
}
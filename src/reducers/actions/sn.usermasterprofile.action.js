import { ACT_TY_SET_USER_MASTER_PROFILE,
    ACT_TY_GET_USER_MASTER_PROFILE } from "./sn.action.constants";
    import store from "..";
    import { STORAGE_USER_MASTER_PROFILE_KEY, BROWSER_STORAGE } from "../../sn.constants";


//get internally calls set from epic
export const setUserMasterProfileAction = (userMasterProfile) => {
  if (userMasterProfile==null){
    BROWSER_STORAGE.removeItem(STORAGE_USER_MASTER_PROFILE_KEY);
} else {
    BROWSER_STORAGE.setItem(STORAGE_USER_MASTER_PROFILE_KEY, JSON.stringify(userMasterProfile));
}
  return {
    type: ACT_TY_SET_USER_MASTER_PROFILE,
    payload: userMasterProfile,
  };
};
//This method is called during login and on Profile Page
export const getUserMasterProfileAction = (session) => {
    session = session!=null ? session : store.getState().userSession;
    return {
      type: ACT_TY_GET_USER_MASTER_PROFILE,
      payload: session,
    };
  };

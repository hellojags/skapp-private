import {
  ACT_TY_SET_BLOCKSTACK_USER,
  ACT_TY_FETCH_BLOCKSTACK_USER,
  ACT_TY_LOGOUT_BLOCKSTACK_USER,
} from "./sn.action.constants";
import { STORAGE_USER_KEY, BROWSER_STORAGE,ID_PROVIDER_SKYID } from "../../sn.constants";
import { setSkyspaceList, fetchSkyspaceList } from "./sn.skyspace-list.action";
import store from "../";

export const setPerson = (state) => {
  if (state == null) {
    BROWSER_STORAGE.removeItem(STORAGE_USER_KEY);
  } else {
    BROWSER_STORAGE.setItem(STORAGE_USER_KEY, JSON.stringify(state));
  }
  return {
    type: ACT_TY_SET_BLOCKSTACK_USER,
    payload: state,
  };
};

export const setPersonGetOtherData = (state) => {
  store.dispatch(fetchSkyspaceList(null));
  return setPerson(state);
};

export const fetchBlockstackPerson = (userSession) => {
  return {
    type: ACT_TY_FETCH_BLOCKSTACK_USER,
    payload: userSession,
  };
};

export const logoutPerson = (userSession) => {
  BROWSER_STORAGE.clear();
  store.dispatch(setSkyspaceList(null));
  // if (userSession.skydbseed) {
  //   window.location.href=window.location.origin;
  //   return setPerson(null);
  // }
  // else if (userSession.idp == ID_PROVIDER_SKYID)
  // {
  //   window.location.href=window.location.origin;
  // }
  // else//--> assume default is SkyID
  // {
  //   userSession.skyid.sessionDestroy("/");
  //   window.location.href=window.location.origin;
  // }
  return {
    type: ACT_TY_LOGOUT_BLOCKSTACK_USER,
    payload: userSession,
  };
};

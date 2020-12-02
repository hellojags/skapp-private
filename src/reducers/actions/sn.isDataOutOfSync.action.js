import {
    ACT_TY_SET_DATA_SYNC_STATUS
  } from "./sn.action.constants";
import store from "..";  
  // true: data is out-of-sync, false: data is in sync
  export const setIsDataOutOfSync = (state) => {
    return {
      type: ACT_TY_SET_DATA_SYNC_STATUS,
      payload: state,
    };
  };
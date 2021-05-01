import {ACT_TY_SET_APP_COMMENTS, EPIC_TY_SET_APP_COMMENTS, EPIC_TY_GET_APP_COMMENTS} from "../SnActionConstants";

export const setAppCommentAction = (appId,data) => ({
  type: EPIC_TY_SET_APP_COMMENTS,
  payload: {appId,data},
})
export const getAppCommentAction = (appId) => ({
  type: EPIC_TY_GET_APP_COMMENTS,
  payload: appId,
})
// Like, Fav, View, Access 
export const setAppCommentStore = (appCommentsJSON) => ({
  type: ACT_TY_SET_APP_COMMENTS,
  payload: appCommentsJSON,
})

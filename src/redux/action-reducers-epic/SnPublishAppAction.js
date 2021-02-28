import {ACT_TY_SET_PUBLISHED_APPS,EPIC_TY_PUBLISH_APP,EPIC_TY_GET_PUBLISHED_APPS,
  ACT_TY_SET_APP_COMMENTS, EPIC_TY_SET_APP_COMMENTS, EPIC_TY_GET_APP_COMMENTS} from "../SnActionConstants";

export const publishAppAction = (data) => ({
  type: EPIC_TY_PUBLISH_APP,
  payload: data,
})
export const getPublishedAppsAction = () => ({
  type: EPIC_TY_GET_PUBLISHED_APPS,
  payload: null,
})
// Like, Fav, View, Access 
export const setPublishedAppsStore = (appsJSON) => ({
  type: ACT_TY_SET_PUBLISHED_APPS,
  payload: appsJSON,
})

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

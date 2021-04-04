import {ACT_TY_SET_MY_PUBLISHED_APPS,EPIC_TY_PUBLISH_APP,EPIC_TY_GET_ALL_PUBLISHED_APPS,EPIC_TY_GET_MY_PUBLISHED_APPS} from "../SnActionConstants";

export const publishAppAction = (data) => ({
  type: EPIC_TY_PUBLISH_APP,
  payload: data,
})

export const getMyPublishedAppsAction = () => ({
  type: EPIC_TY_GET_MY_PUBLISHED_APPS,
  payload: null,
})

// Like, Fav, View, Access 
export const setPublishedAppsStore = (appsJSON) => ({
  type: ACT_TY_SET_MY_PUBLISHED_APPS,
  payload: appsJSON,
})
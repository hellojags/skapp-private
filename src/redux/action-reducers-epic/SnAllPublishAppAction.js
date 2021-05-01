import { ACT_TY_SET_ALL_PUBLISHED_APPS, EPIC_TY_GET_ALL_PUBLISHED_APPS } from "../SnActionConstants"
export const getAllPublishedAppsAction = (sortOn, orderBy, n) => ({
  type: EPIC_TY_GET_ALL_PUBLISHED_APPS,
  payload: null,
  sortBy: { sortOn, orderBy, n }
})

// Like, Fav, View, Access 
export const setAllPublishedAppsStore = (appsJSON) => ({
  type: ACT_TY_SET_ALL_PUBLISHED_APPS,
  payload: appsJSON,
})
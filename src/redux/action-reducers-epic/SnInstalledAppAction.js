import {ACT_TY_SET_MY_INSTALLED_APPS,EPIC_TY_INSTALLED_APP,EPIC_TY_UNINSTALLED_APP,EPIC_TY_GET_MY_INSTALLED_APPS} from "../SnActionConstants";

export const installedAppAction = (data) => ({
  type: EPIC_TY_INSTALLED_APP,
  payload: data,
})

export const unInstalledAppAction = (data) => ({
    type: EPIC_TY_UNINSTALLED_APP,
    payload: data,
})

export const getMyInstalledAppsAction = () => ({
  type: EPIC_TY_GET_MY_INSTALLED_APPS,
  payload: null,
})

// Like, Fav, View, Access 
export const setInstalledAppsStore = (appsJSON) => ({
  type: ACT_TY_SET_MY_INSTALLED_APPS,
  payload: appsJSON,
})
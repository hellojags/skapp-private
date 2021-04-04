import {EPIC_TY_GET_STATS,EPIC_TY_SET_STATS, ACT_TY_STATS_ACTION} from "../SnActionConstants";

export const setAppStatsAction = (actionType, appId) => ({
  type: EPIC_TY_SET_STATS,
  payload: {actionType, appId},
})
export const getAppStatsAction = (appId) => ({
  type: EPIC_TY_GET_STATS,
  payload: appId,
})
// Like, Fav, View, Access 
export const setAppStatsStore = (appStatsJSON) => ({
  type: ACT_TY_STATS_ACTION,
  payload: appStatsJSON,
})

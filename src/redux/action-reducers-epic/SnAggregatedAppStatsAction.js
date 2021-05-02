import {EPIC_TY_AGG_GET_STATS,EPIC_TY_AGG_SET_STATS, ACT_TY_AGG_STATS_ACTION} from "../SnActionConstants";

//This will be called from Timmer Loop
export const setAggregatedAppStatsAction = (actionType, data, appIdList) => ({
  type: EPIC_TY_AGG_SET_STATS,
  payload: appIdList,
})


export const getAggregatedAppStatsAction = (appId) => ({
  type: EPIC_TY_AGG_GET_STATS,
  payload: appId,
})
// Like, Fav, View, Access 
export const setAggregatedAppStatsStore = (appStatsJSON) => ({
  type: ACT_TY_AGG_STATS_ACTION,
  payload: appStatsJSON,
})

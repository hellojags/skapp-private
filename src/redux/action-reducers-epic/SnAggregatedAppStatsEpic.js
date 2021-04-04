import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import { EPIC_TY_AGG_SET_STATS, EPIC_TY_AGG_GET_STATS } from "../SnActionConstants"
import store from ".."
// app stats actions
export const snSetAggregatedAppStatsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_AGG_SET_STATS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                return from(getAggregatedAppStats(action.payload.appIdList))
                    .pipe(
                        map((res) => {
                            //setLoaderDisplay(false)
                            // Update Redux Store
                            return  setAggregatedAppStatsStore(res)
                        })
                    )
            }));

export const snGetAggregatedAppStatsEpic = (action$) => action$.pipe(ofType(EPIC_TY_AGG_GET_STATS),
    // do we need to change this to mergemap ? we dont want subscription to be overwritten
    switchMap((action) => {
        setLoaderDisplay(true)
        return from(getAggregatedAppStats(action.payload.appId))
            .pipe(
                map((res) => {
                    setLoaderDisplay(false)
                    // Update Redux Store
                    return setAggregatedAppStatsStore(res)
                })
            )
    }));
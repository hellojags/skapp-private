import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import { EPIC_TY_SET_STATS, EPIC_TY_GET_STATS } from "../SnActionConstants"
import { setAppStats, getAppStats } from "../../service/SnSkappService"
import { setAppStatsStore } from "./SnAppStatsAction"

// app stats actions
export const snSetAppStatsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_SET_STATS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                return from(setAppStats(action.payload.actionType, action.payload.data, action.payload.id))
                    .pipe(
                        map((res) => {
                            setLoaderDisplay(false)
                            // Update Redux Store
                            return setAppStatsStore(res)
                        })
                    )
            }));

export const snGetAppStatsEpic = (action$) => action$.pipe(ofType(EPIC_TY_GET_STATS),
    // do we need to change this to mergemap ? we dont want subscription to be overwritten
    switchMap((action) => {
        setLoaderDisplay(true)
        return from(getAppStats(action.payload.id))
            .pipe(
                map((res) => {
                    setLoaderDisplay(false)
                    // Update Redux Store
                    return setAppStatsStore(res)
                })
            )
    }));
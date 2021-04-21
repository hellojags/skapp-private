import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import {
    EPIC_TY_GET_ALL_PUBLISHED_APPS,
} from "../SnActionConstants"
import { getAllPublishedApps } from "../../service/SnSkappService"
import { setAllPublishedAppsStore } from "./SnAllPublishAppAction"
// app stats actions
import store from ".."
export const snGetAllPublishedAppsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_ALL_PUBLISHED_APPS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log("sortby", action.sortBy)
                store.dispatch(setLoaderDisplay(true))
                return from(getAllPublishedApps(action.sortBy.sortOn, action.sortBy.orderBy, action.sortBy.n))
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setAllPublishedAppsStore(res)
                        })
                    )
            }))


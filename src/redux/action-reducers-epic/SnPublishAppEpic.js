import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import {
    EPIC_TY_PUBLISH_APP, EPIC_TY_GET_MY_PUBLISHED_APPS,
    
} from "../SnActionConstants";
import { publishApp, getMyPublishedApps } from "../../service/SnSkappService"
import { setPublishedAppsStore } from "./SnPublishAppAction"
// app stats actions
import store from "../../redux"
export const snSetPublishAppEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_PUBLISH_APP),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log("snPublishAppEpic ", action)
                store.dispatch(setLoaderDisplay(true))
                return from(publishApp(action.payload)) // must return all published app
                    .pipe(
                        map((res) => {
                            //const apps = await getAllPublishedApps();
                            store.dispatch(setLoaderDisplay(false))
                            //action.payload.manageSubmitLoader(false)
                            // Update Redux Store
                            return setPublishedAppsStore(res)
                        })
                    )
            }));
export const snGetPublishedAppsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_MY_PUBLISHED_APPS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                store.dispatch(setLoaderDisplay(true))
                return from(getMyPublishedApps())
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setPublishedAppsStore(res)
                        })
                    )
            }));


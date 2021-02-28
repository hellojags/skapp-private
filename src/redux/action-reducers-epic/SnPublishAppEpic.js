import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import {
    EPIC_TY_PUBLISH_APP, EPIC_TY_GET_PUBLISHED_APPS,
    EPIC_TY_SET_APP_COMMENTS, EPIC_TY_GET_APP_COMMENTS
} from "../SnActionConstants";
import { publishApp, getAllPublishedApps, setAppComment, getAppComments } from "../../service/SnSkappService"
import { setAppCommentStore, setPublishedAppsStore } from "./SnPublishAppAction"
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
        pipe(ofType(EPIC_TY_GET_PUBLISHED_APPS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                store.dispatch(setLoaderDisplay(true))
                return from(getAllPublishedApps())
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setPublishedAppsStore(res)
                        })
                    )
            }));
export const snSetAppCommentEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_SET_APP_COMMENTS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                store.dispatch(setLoaderDisplay(true))
                return from(setAppComment(action.payload.appId, action.payload.data))
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setAppCommentStore(res)
                        })
                    )
            }));

export const snGetAppCommentsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_APP_COMMENTS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                store.dispatch(setLoaderDisplay(true))
                return from(getAppComments(action.payload.appId))
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setAppCommentStore(res)
                        })
                    )
            }));
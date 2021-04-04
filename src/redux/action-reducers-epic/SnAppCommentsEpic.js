import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import {
    EPIC_TY_SET_APP_COMMENTS, EPIC_TY_GET_APP_COMMENTS
} from "../SnActionConstants";
import { setAppComment, getAppComments } from "../../service/SnSkappService"
import { setAppCommentStore } from "./SnAppCommentsAction"
// app stats actions
import store from ".."

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
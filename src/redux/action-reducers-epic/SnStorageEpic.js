import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { EPIC_TY_SET_STORAGE, EPIC_TY_GET_STORAGE, EPIC_TY_DELETE_STORAGE, EPIC_TY_EDIT_STORAGE } from "../SnActionConstants"
import { setStorageAction } from "./SnStorageAction"
import { setLoaderDisplay } from "./SnLoaderAction"
import { setStorage, getStorages, deleteStorage, editStorage } from "../../service/SnSkappService"
import store from ".."

export const snStorageEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_SET_STORAGE),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(setStorage(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setStorageAction(res)
                })
            )
        })
    )

export const snDeleteStorageEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_DELETE_STORAGE),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(deleteStorage(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains del:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setStorageAction(res)
                })
            )
        })
    )

export const snEditStorageEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_EDIT_STORAGE),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(editStorage(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setStorageAction(res)
                })
            )
        })
    )

export const snGetStorageEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_STORAGE),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log('aya');
                store.dispatch(setLoaderDisplay(true))
                return from(getStorages())
                    .pipe(
                        map((res) => {

                            console.log('aya r: ', res);
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setStorageAction(res)
                        })
                    )
            }));
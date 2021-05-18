import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { EPIC_TY_SET_DOMAIN, EPIC_TY_GET_DOMAIN, EPIC_TY_DELETE_DOMAIN, EPIC_TY_EDIT_DOMAIN } from "../SnActionConstants"
import { setDomainAction } from "./SnDomainAction"
import { setLoaderDisplay } from "./SnLoaderAction"
import { setDomain, getDomains, deleteDomain, editDomain } from "../../service/SnSkappService"
import store from "../../redux"

export const snDomainEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_SET_DOMAIN),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(setDomain(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setDomainAction(res)
                })
            )
        })
    )

export const snDeleteDomainEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_DELETE_DOMAIN),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(deleteDomain(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains del:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setDomainAction(res)
                })
            )
        })
    )

export const snEditDomainEpic = (action$) =>
    action$.pipe(
        ofType(EPIC_TY_EDIT_DOMAIN),
        switchMap((action) => {
            console.log("user setting epic", action)
            store.dispatch(setLoaderDisplay(true))
            return from(editDomain(action.payload)).pipe(
                map((res) => {
                    console.log(`User Domains:${res}`)
                    store.dispatch(setLoaderDisplay(false))
                    return setDomainAction(res)
                })
            )
        })
    )

export const snGetDomainEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_DOMAIN),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log('aya');
                store.dispatch(setLoaderDisplay(true))
                return from(getDomains())
                    .pipe(
                        map((res) => {

                            console.log('aya r: ', res);
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setDomainAction(res)
                        })
                    )
            }));
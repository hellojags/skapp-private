import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { setLoaderDisplay } from "./SnLoaderAction"
import {
    EPIC_TY_INSTALLED_APP, EPIC_TY_GET_MY_INSTALLED_APPS,
    EPIC_TY_UNINSTALLED_APP, EPIC_TY_INSTALLED_FOR_LOGIN_APP
} from "../SnActionConstants";
import { getMyInstalledApps, installApp, uninstallApp } from "../../service/SnSkappService"
import { setInstalledAppsStore, installedAppActionForLogin } from "./SnInstalledAppAction"
// app stats actions
import store from "../../redux"
export const snSetInstallAppEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_INSTALLED_APP),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log("snInstalledAppEpic ", action)
                store.dispatch(setLoaderDisplay(true))
                return from(installApp(action.payload)) // must return all published app
                    .pipe(
                        map((res) => {
                            store.dispatch(installedAppActionForLogin(null));
                            store.dispatch(setLoaderDisplay(false))
                            return setInstalledAppsStore(res)
                        })
                    )
            }));
export const snSetUnInstallAppEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_UNINSTALLED_APP),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten
            switchMap((action) => {
                console.log("snUnInstalledAppEpic ", action)
                store.dispatch(setLoaderDisplay(true))
                return from(uninstallApp(action.payload)) // must return all published app
                    .pipe(
                        map((res) => {
                            store.dispatch(installedAppActionForLogin(null));
                            store.dispatch(setLoaderDisplay(false))
                            return setInstalledAppsStore(res)
                        })
                    )
            }));
export const snGetInstalledAppsEpic = (action$) =>
    action$.
        pipe(ofType(EPIC_TY_GET_MY_INSTALLED_APPS),
            // do we need to change this to mergemap ? we dont want subscription to be overwritten

            switchMap((action) => {
                store.dispatch(setLoaderDisplay(true))
                return from(getMyInstalledApps())
                    .pipe(
                        map((res) => {
                            store.dispatch(setLoaderDisplay(false))
                            // Update Redux Store
                            return setInstalledAppsStore(res)
                        })
                    )
            }));


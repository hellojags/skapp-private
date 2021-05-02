import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { EPIC_TY_SET_USER_PROFILE } from "../SnActionConstants"
import { setUserProfileAction } from "./SnUserProfileAction"
import { setLoaderDisplay } from "./SnLoaderAction"
import { setProfile } from "../../service/SnSkappService"
import store from "../../redux"

export const snUserProfileEpic = (action$) =>
  action$.pipe(
    ofType(EPIC_TY_SET_USER_PROFILE),
    switchMap((action) => {
      console.log("user setting epic", action)
      store.dispatch(setLoaderDisplay(true))
      return from(setProfile(action.payload)).pipe(
        map((res) => {
          console.log(`User Profile:${res}`)
          store.dispatch(setLoaderDisplay(false))
          return setUserProfileAction(res)
        })
      )
    })
  )

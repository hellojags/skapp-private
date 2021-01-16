import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_USER_PROFILE } from "./actions/sn.action.constants"
import { setUserProfileAction } from "./actions/sn.userprofile.action"
import { setLoaderDisplay } from "./actions/sn.loader.action"
import { bsGetUserAppProfile } from "../blockstack/blockstack-api"

export const snUserProfileEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_GET_USER_PROFILE),
    switchMap((action) => {
      console.log("user setting epic", action)
      setLoaderDisplay(true)
      return from(bsGetUserAppProfile(action.payload)).pipe(
        map((res) => {
          console.log(`User Profile:${res}`)
          setLoaderDisplay(false)
          return setUserProfileAction(res)
        })
      )
    })
  )
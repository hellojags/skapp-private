import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_MY_FOLLOWERS } from "./actions/sn.action.constants"
import { setMyFollowersAction } from "./actions/sn.myFollower.action"
import { setLoaderDisplay } from "./actions/sn.loader.action"
import { getFollowersJSON } from "../blockstack/blockstack-api"

export const snMyFollowersEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_GET_MY_FOLLOWERS),
    switchMap((action) => {
      setLoaderDisplay(true)
      return from(getFollowersJSON(action.payload)).pipe(
        map((res) => {
          setLoaderDisplay(false)
          return setMyFollowersAction(res)
        })
      )
    })
  )

import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_MY_FOLLOWINGS } from "./actions/sn.action.constants"
import { setMyFollowingsAction } from "./actions/sn.myFollowing.action"
import { setLoaderDisplay } from "./actions/sn.loader.action"
import { getFollowingsJSON } from "../blockstack/blockstack-api"

export const snMyFollowingsEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_GET_MY_FOLLOWINGS),
    switchMap((action) => {
      setLoaderDisplay(true)
      return from(getFollowingsJSON(action.payload)).pipe(
        map((res) => {
          setLoaderDisplay(false)
          return setMyFollowingsAction(res)
        })
      )
    })
  )

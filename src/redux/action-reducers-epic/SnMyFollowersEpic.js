import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_MY_FOLLOWERS } from "../SnActionConstants"
import { setMyFollowersAction } from "./SnMyFollowerAction"
import { setLoaderDisplay } from "./SnLoaderAction"
import { getFollowersJSON } from "../../service/SnSkappService"

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

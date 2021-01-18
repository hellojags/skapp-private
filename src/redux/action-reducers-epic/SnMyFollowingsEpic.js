import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_MY_FOLLOWINGS } from "../SnActionConstants"
import { setMyFollowingsAction } from "./SnMyFollowingAction"
import { setLoaderDisplay } from "./SnLoaderAction"
import { getFollowingsJSON } from "../../service/SnSkappService"

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

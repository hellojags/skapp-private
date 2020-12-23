import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACTY_TY_FETCH_HISTORY } from "./actions/sn.action.constants"
import { getUserHistory } from "../blockstack/blockstack-api"
import { fetchHistorySuccess } from "./actions/sn.history.action"

export const fetchHistoryEpic = (action$) =>
  action$.pipe(
    ofType(ACTY_TY_FETCH_HISTORY),
    switchMap((action) =>
      from(getUserHistory(action.payload)).pipe(
        map((res) =>
          fetchHistorySuccess(
            res.sort(
              (obj1, obj2) =>
                new Date(obj2.lastUpdateTS) - new Date(obj1.lastUpdateTS)
            )
          )
        )
      )
    )
  )

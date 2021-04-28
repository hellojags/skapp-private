import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { EPIC_TY_SET_USER_PREFERENCES } from "../SnActionConstants"
import { setUserPreferencesAction } from "./SnUserPreferencesAction"
import { setPreferences } from "../../service/SnSkappService"

export const snUserPreferencesEpic = (action$) =>
  action$.pipe(
    ofType(EPIC_TY_SET_USER_PREFERENCES),
    switchMap((action) =>
      from(setPreferences(action.payload)).pipe(
        map((res) => setUserPreferencesAction(action.payload))
      )
    )
  )

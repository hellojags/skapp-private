import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import {
  ACT_TY_LOGOUT_SKYDB_USER,
} from "../SnActionConstants"
import { setPerson } from "./SnPersonAction"
import { clearAllfromDB, IDB_STORE_SKAPP } from "../db/indexedDB"


export const logoutPersonEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_LOGOUT_SKYDB_USER),
    switchMap((action) =>
      // return from(action.payload.signUserOut(window.location.origin)).pipe(
      from(clearAllfromDB({ store: IDB_STORE_SKAPP })).pipe(
        map((res) => setPerson(null))
      )
    )
  )

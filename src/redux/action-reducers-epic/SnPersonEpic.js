import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import {
  ACT_TY_FETCH_BLOCKSTACK_USER,
  ACT_TY_LOGOUT_BLOCKSTACK_USER,
} from "../SnActionConstants"
import { setPersonGetOtherData, setPerson } from "./SnPersonAction"
import { fetchSkyspaceList } from "./actions/sn.skyspace-list.action"
import { bsSavePublicKey } from "../../service/SnSkappService"
import { clearAllfromDB, IDB_STORE_SKAPP } from "../db/indexedDB"

export const snPersonEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_BLOCKSTACK_USER),
    switchMap((action) =>
      from(action.payload.handlePendingSignIn()).pipe(
        map((res) => {
          bsSavePublicKey(action.payload)
          fetchSkyspaceList(action.payload)
          return setPersonGetOtherData(res)
        })
      )
    )
  )

export const logoutPersonEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_LOGOUT_BLOCKSTACK_USER),
    switchMap((action) =>
      // return from(action.payload.signUserOut(window.location.origin)).pipe(
      from(clearAllfromDB({ store: IDB_STORE_SKAPP })).pipe(
        map((res) => setPerson(null))
      )
    )
  )

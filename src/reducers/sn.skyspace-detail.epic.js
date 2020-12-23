import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_FETCH_SKYSPACE_DETAIL } from "./actions/sn.action.constants"
import { setSkyspaceDetail } from "./actions/sn.skyspace-detail.action"
import { bsGetAllSkyspaceObj } from "../blockstack/blockstack-api"

export const snSetSkypaceDetailEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_DETAIL),
    switchMap((action) =>
      from(bsGetAllSkyspaceObj(action.payload)).pipe(
        map((res) => setSkyspaceDetail(res))
      )
    )
  )

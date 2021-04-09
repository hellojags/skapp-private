import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_GET_USER_MASTER_PROFILE } from "../SnActionConstants"
import { setUserMasterProfileAction } from "./SnUserMasterProfileA"
import { bsGetUserMasterProfile } from "../../service/SnSkappService"

export const snUserMasterProfileEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_GET_USER_MASTER_PROFILE),
    switchMap((action) =>
      from(bsGetUserMasterProfile(action.payload)).pipe(
        map((res) => setUserMasterProfileAction(JSON.parse(res)))
      )
    )
  )

import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_FETCH_SKYSPACE_APP_COUNT } from "./actions/sn.action.constants"
import { setSkyspaceAppCount } from "./actions/sn.skyspace-app-count.action"
import { bsGetSkyspaceAppCount } from "../blockstack/blockstack-api"

export const snSkyspaceAppCountEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_APP_COUNT),
    switchMap((action) =>
      from(bsGetSkyspaceAppCount(action.payload)).pipe(
        map((res) => setSkyspaceAppCount(res))
      )
    )
  )

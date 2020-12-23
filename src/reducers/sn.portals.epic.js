import { ofType } from "redux-observable"
import { switchMap, map } from "rxjs/operators"
import { from } from "rxjs"
import { ACT_TY_FETCH_PORTALS_LIST } from "./actions/sn.action.constants"
import { setPortalsListAction } from "./actions/sn.portals.action"
import { setLoaderDisplay } from "./actions/sn.loader.action"
import { bsGetPortalsList } from "../blockstack/blockstack-api"

export const snPortalsListEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_PORTALS_LIST),
    switchMap((action) => {
      setLoaderDisplay(true)
      return from(bsGetPortalsList(action.payload)).pipe(
        map((res) => {
          setLoaderDisplay(false)
          return setPortalsListAction(res)
        })
      )
    })
  )

import { ACT_TY_SET_USER_PROFILE } from "./actions/sn.action.constants"
import { STORAGE_USER_APP_PROFILE_KEY, BROWSER_STORAGE } from "../sn.constants"

export default (state = null, action) => {
  switch (action.type) {
    case ACT_TY_SET_USER_PROFILE:
      return action.payload
    default:
      if (state == null) {
        state = BROWSER_STORAGE.getItem(STORAGE_USER_APP_PROFILE_KEY)
        if (state != null) {
          state = JSON.parse(state)
        }
      }
      return state
  }
}

import { ACT_TY_SET_USER_PREFERENCES } from "../SnActionConstants"
import { STORAGE_USER_PREFERENCES_KEY, BROWSER_STORAGE } from "../../utils/SnConstants"

export default (state = null, action) => {
  switch (action.type) {
    case ACT_TY_SET_USER_PREFERENCES:
      return action.payload
    default:
      if (state == null) {
        state = BROWSER_STORAGE.getItem(STORAGE_USER_PREFERENCES_KEY)
        if (state != null) {
          state = JSON.parse(state)
        }
      }
      return state
  }
}

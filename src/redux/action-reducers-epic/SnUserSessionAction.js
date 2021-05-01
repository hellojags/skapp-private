import {
  BROWSER_STORAGE,
  STORAGE_USER_SESSION_KEY,
  ID_PROVIDER_SKYID,
} from "../../utils/SnConstants"
import { ACT_TY_SET_USER_SESSION } from "../SnActionConstants"

export const setUserSession = (userSession) => {
  BROWSER_STORAGE.setItem(STORAGE_USER_SESSION_KEY, JSON.stringify(userSession))
  return {
    type: ACT_TY_SET_USER_SESSION,
    payload: userSession,
  }
}

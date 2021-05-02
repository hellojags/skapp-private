import {
  BROWSER_STORAGE,
} from "../../utils/SnConstants"
import { ACT_TY_SET_USER_SESSION } from "../SnActionConstants"

export const setUserSession = (userSession) => {
  return {
    type: ACT_TY_SET_USER_SESSION,
    payload: userSession,
  }
}

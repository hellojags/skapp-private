import { UserSession, AppConfig } from "blockstack"
import { ACT_TY_SET_USER_SESSION } from "../SnActionConstants"
import { BROWSER_STORAGE, STORAGE_USER_SESSION_KEY } from "../../utils/SnConstants"

const appConfig = new AppConfig(["store_write", "publish_data"])
const userSession = new UserSession({ appConfig })

const getUserSession = () => {
  const strUserSession = BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY)
  if (strUserSession != null) {
    return JSON.parse(strUserSession)
  }
  const appConfig = new AppConfig(["store_write", "publish_data"])
  const userSession = new UserSession({ appConfig })
  return userSession
}

export default (state = getUserSession(), action) => {
  switch (action.type) {
    case ACT_TY_SET_USER_SESSION:
      return action.payload
    default:
      return state
  }
}

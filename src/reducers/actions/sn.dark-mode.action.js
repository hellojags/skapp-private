import { ACT_TY_CHANGE_DARK_MODE_STATE } from "./sn.action.constants"
import { STORAGE_DARK_MODE_KEY } from "../../sn.constants"

export const setDarkMode = (darkMode) => {
  localStorage.setItem(STORAGE_DARK_MODE_KEY, JSON.stringify(darkMode))
  return {
    type: ACT_TY_CHANGE_DARK_MODE_STATE,
    payload: darkMode,
  }
}

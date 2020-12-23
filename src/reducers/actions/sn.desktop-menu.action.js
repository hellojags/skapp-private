import { ACT_TY_CHANGE_DESKTOP_MENU_STATE } from "./sn.action.constants"
import store from ".."

export const setDesktopMenuState = (newMenuState) => ({
  type: ACT_TY_CHANGE_DESKTOP_MENU_STATE,
  payload: newMenuState,
})
export const toggleDesktopMenuDisplay = () =>
  setDesktopMenuState(!store.getState().snShowDesktopMenu)

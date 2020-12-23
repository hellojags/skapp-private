import { ACT_TY_CHANGE_MOBILE_MENU_STATE } from "./sn.action.constants"
import store from ".."

export const setMobileMenuDisplay = (newMobMenuState) => ({
  type: ACT_TY_CHANGE_MOBILE_MENU_STATE,
  payload: newMobMenuState,
})
export const toggleMobileMenuDisplay = () =>
  setMobileMenuDisplay(!store.getState().snShowMobileMenu)

import { ACT_TY_CHANGE_TOPBAR_STATE } from "./sn.action.constants"
import store from ".."

export const setTopbarDisplay = (newTopbarDisplayState) => ({
  type: ACT_TY_CHANGE_TOPBAR_STATE,
  payload: newTopbarDisplayState,
})
export const toggleTopbarDisplay = () =>
  setTopbarDisplay(!store.getState().snTopbarDisplay)

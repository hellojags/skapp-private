import { ACT_TY_SET_DATA_SYNC_STATUS } from "./sn.action.constants"

export const setIsDataOutOfSync = (state) => ({
  type: ACT_TY_SET_DATA_SYNC_STATUS,
  payload: state,
})

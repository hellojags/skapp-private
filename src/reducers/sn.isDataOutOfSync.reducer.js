import { ACT_TY_SET_DATA_SYNC_STATUS } from "./actions/sn.action.constants"

export default (state = false, action) => {
  switch (action.type) {
    case ACT_TY_SET_DATA_SYNC_STATUS:
      return action.payload
    default:
      return state
  }
}

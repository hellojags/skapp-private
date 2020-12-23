import { ACTY_TY_SET_HISTORY } from "./actions/sn.action.constants"

export default (state = [], action) => {
  switch (action.type) {
    case ACTY_TY_SET_HISTORY:
      return action.payload
    default:
      return state
  }
}

import { ACT_TY_SET_MY_FOLLOWINGS } from "./actions/sn.action.constants"

export default (state = [], action) => {
  switch (action.type) {
    case ACT_TY_SET_MY_FOLLOWINGS:
      return action.payload
    default:
      return state
  }
}

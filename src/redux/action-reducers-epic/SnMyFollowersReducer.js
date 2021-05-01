import { ACT_TY_SET_MY_FOLLOWERS } from "../SnActionConstants"

export default (state = [], action) => {
  switch (action.type) {
    case ACT_TY_SET_MY_FOLLOWERS:
      return action.payload
    default:
      return state
  }
}

import { ACT_TY_CHANGE_SHOW_HOSTING_LINKS_STATE } from "../SnActionConstants";

export default (state = false, action) => {
  switch (action.type) {
    case ACT_TY_CHANGE_SHOW_HOSTING_LINKS_STATE:
      return action.payload
    default:
      return state
  }
}

import {ACT_TY_AGG_STATS_ACTION } from "../SnActionConstants";

export default (state = null, action) => {
  switch (action.type) {
    case ACT_TY_AGG_STATS_ACTION:
      return action.payload
    default:
      return state
  }
}
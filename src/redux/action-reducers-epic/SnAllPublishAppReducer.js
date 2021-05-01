import {ACT_TY_SET_ALL_PUBLISHED_APPS, ACT_TY_SET_APP_COMMENTS} from "../SnActionConstants";

export default (state = [], action) => {
  switch (action.type) {
    case ACT_TY_SET_ALL_PUBLISHED_APPS:
      //return {...state, publishedAppsStore : action.payload}
      return action.payload
    default:
      return state
  }
}
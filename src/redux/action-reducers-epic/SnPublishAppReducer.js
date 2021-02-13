import {ACT_TY_SET_PUBLISHED_APPS, ACT_TY_SET_APP_COMMENTS} from "../SnActionConstants";
let initState = {
  publishedAppsStore: [],
  appCommentsStore: [],
};
export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_PUBLISHED_APPS:
      return {...state, publishedAppsStore : action.payload}
    case ACT_TY_SET_APP_COMMENTS:
      return {...state, appCommentsStore : action.payload}
    default:
      return state
  }
}
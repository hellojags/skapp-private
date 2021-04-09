import {ACT_TY_SET_MY_PUBLISHED_APPS} from "../SnActionConstants";
let initState = {
  publishedAppsStore: []
};
export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_MY_PUBLISHED_APPS:
      return {...state, publishedAppsStore : action.payload}
    default:
      return state
  }
}
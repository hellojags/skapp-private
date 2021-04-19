import {ACT_TY_SET_MY_INSTALLED_APPS} from "../SnActionConstants";
let initState = {
  installedAppsStore: []
};
export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_MY_INSTALLED_APPS:
        console.log('in action');
      return {...state, installedAppsStore : action.payload}
    default:
      return state
  }
}
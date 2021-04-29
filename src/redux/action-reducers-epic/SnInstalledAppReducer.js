import {ACT_TY_SET_MY_INSTALLED_APPS, EPIC_TY_INSTALLED_FOR_LOGIN_APP} from "../SnActionConstants";
let initState = {
  installedAppsStore: [],
  installedAppsStoreForLogin: null
};
export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_MY_INSTALLED_APPS:
      return {...state, installedAppsStore : action.payload}
    case EPIC_TY_INSTALLED_FOR_LOGIN_APP: 
      return {...state, installedAppsStoreForLogin : action.payload}
    default:
      return state
  }
}
import { combineReducers, createStore } from "redux";
import { combineEpics } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";

import SnLoaderReducer from "./action-reducers-epic/SnLoaderReducer";
// import SnPerson from "./sn.person.reducer"
// import SnUserProfile from "./sn.userprofile.reducer"
// import { snUserProfileEpic } from "./sn.userprofile.epic"
// import SnUserMasterProfile from "./sn.usermasterprofile.reducer"
// import { snUserMasterProfileEpic } from "./sn.usermasterprofile.epic"
// import SnMyFollowers from "./sn.myFollowers.reducer"
// import { snMyFollowersEpic } from "./sn.myFollowers.epic"
// import SnMyFollowings from "./sn.myFollowings.reducer"
// import { snMyFollowingsEpic } from "./sn.myFollowings.epic"
import SnUploadListReducer from "./action-reducers-epic/SnUploadListReducer";
import snSelectedHostedAppStore from "./action-reducers-epic/SnSelectedHostedAppReducer";
import snPublishedAppsStore from "./action-reducers-epic/SnPublishAppReducer";
import snAppStatsStore from "./action-reducers-epic/SnAppStatsReducer";
import {snAppStatsEpic} from "./action-reducers-epic/SnAppStatsEpic";
import {snPublishAppEpic} from "./action-reducers-epic/SnPublishAppEpic";


const redux = require("redux")
const { createEpicMiddleware } = require("redux-observable")

const rootReducer = combineReducers({
  snLoader: SnLoaderReducer,
  // userSession: SnUserSessionReducer,
  // person: SnPerson,
  // snUserProfile: SnUserProfile,
  // snUserMasterProfile: SnUserMasterProfile,
  // snMyFollowers: SnMyFollowers,
  // snMyFollowings: SnMyFollowings,
  snUploadListStore: SnUploadListReducer,
  snPublishedAppsStore,
  snAppStatsStore,
  snSelectedHostedAppStore,
});

const rootEpic = combineEpics(
  snAppStatsEpic,
  snPublishAppEpic,
  // snPersonEpic,
  // logoutPersonEpic,
  // snUserProfileEpic,
  // snUserMasterProfileEpic,
  // snMyFollowersEpic,
  // snMyFollowingsEpic
)

const observableMiddleware = createEpicMiddleware()
observableMiddleware.run(rootEpic);
const store = createStore(
  rootReducer,
  composeWithDevTools(redux.applyMiddleware(observableMiddleware))
)


export default store;

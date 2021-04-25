import { combineReducers, createStore } from "redux"
import { combineEpics } from "redux-observable"
import { composeWithDevTools } from "redux-devtools-extension"

import SnLoaderReducer from "./action-reducers-epic/SnLoaderReducer"
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
import snAllPublishedAppsStore from "./action-reducers-epic/SnAllPublishAppReducer";
import {snGetAllPublishedAppsEpic} from "./action-reducers-epic/SnAllPublishAppEpic";
import snPublishedAppsStore from "./action-reducers-epic/SnPublishAppReducer";
import snInstalledAppsStore from "./action-reducers-epic/SnInstalledAppReducer";
import {snGetPublishedAppsEpic,snSetPublishAppEpic} from "./action-reducers-epic/SnPublishAppEpic";
import {snGetInstalledAppsEpic, snSetInstallAppEpic, snSetUnInstallAppEpic } from "./action-reducers-epic/SnInstalledAppEpic";
import snAppStatsStore from "./action-reducers-epic/SnAppStatsReducer";
import {snSetAppStatsEpic,snGetAppStatsEpic} from "./action-reducers-epic/SnAppStatsEpic";
import snAppCommentsStore from "./action-reducers-epic/SnAppCommentsReducer";
import {snGetAppCommentsEpic,snSetAppCommentEpic} from "./action-reducers-epic/SnAppCommentsEpic";
import snShowHostingLinks from "./action-reducers-epic/SnShowHostingLinksReducer";
import SnUserSessionReducer from "./action-reducers-epic/SnUserSessionReducer";

const redux = require("redux")
const { createEpicMiddleware } = require("redux-observable")

const rootReducer = combineReducers({
  snLoader: SnLoaderReducer,
  userSession: SnUserSessionReducer,
  // person: SnPerson,
  // snUserProfile: SnUserProfile,
  // snUserMasterProfile: SnUserMasterProfile,
  // snMyFollowers: SnMyFollowers,
  // snMyFollowings: SnMyFollowings,
  snUploadListStore: SnUploadListReducer,
  snAllPublishedAppsStore,
  snPublishedAppsStore,
  snInstalledAppsStore,
  snAppStatsStore,
  snAppCommentsStore,
  snSelectedHostedAppStore,
  snShowHostingLinks
})

const rootEpic = combineEpics(
  snGetAllPublishedAppsEpic,
  snGetPublishedAppsEpic,
  snSetPublishAppEpic,
  snGetInstalledAppsEpic,
  snSetInstallAppEpic,
  snSetUnInstallAppEpic,
  snSetAppStatsEpic,
  snGetAppStatsEpic,
  snGetAppCommentsEpic,
  snSetAppCommentEpic,
  // snPersonEpic,
  // logoutPersonEpic,
  // snUserProfileEpic,
  // snUserMasterProfileEpic,
  // snMyFollowersEpic,
  // snMyFollowingsEpic
)

const observableMiddleware = createEpicMiddleware()

const store = createStore(
  rootReducer,
  composeWithDevTools(redux.applyMiddleware(observableMiddleware))
)
observableMiddleware.run(rootEpic)

export default store

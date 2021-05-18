import { combineReducers, createStore } from "redux"
import { combineEpics } from "redux-observable"
import { composeWithDevTools } from "redux-devtools-extension"

import SnLoaderReducer from "./action-reducers-epic/SnLoaderReducer"
// import SnPerson from "./sn.person.reducer"
import SnUserProfile from "./action-reducers-epic/SnUserProfileReducer"
import { snUserProfileEpic } from "./action-reducers-epic/SnUserProfileEpic"
import SnUserPreferences from "./action-reducers-epic/SnUserPreferencesReducer"
import { snUserPreferencesEpic } from "./action-reducers-epic/SnUserPreferencesEpic"
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
import { snDomainEpic, snGetDomainEpic, snDeleteDomainEpic, snEditDomainEpic } from "./action-reducers-epic/SnDomainEpic";
import SnDomains from "./action-reducers-epic/SnDomainReducer";
import { snStorageEpic, snGetStorageEpic, snDeleteStorageEpic, snEditStorageEpic } from "./action-reducers-epic/SnStorageEpic";
import SnStorages from "./action-reducers-epic/SnStorageReducer";

const redux = require("redux")
const { createEpicMiddleware } = require("redux-observable")

const rootReducer = combineReducers({
  snLoader: SnLoaderReducer,
  userSession: SnUserSessionReducer,
  // person: SnPerson,
  snUserProfile: SnUserProfile,
  snUserPreferences: SnUserPreferences,
  // snMyFollowers: SnMyFollowers,
  // snMyFollowings: SnMyFollowings,
  snUploadListStore: SnUploadListReducer,
  snAllPublishedAppsStore,
  snPublishedAppsStore,
  SnDomains,
  SnStorages,
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
  snDomainEpic,
  snGetDomainEpic,
  snDeleteDomainEpic,
  snEditDomainEpic,
  snStorageEpic,
  snGetStorageEpic,
  snDeleteStorageEpic,
  snEditStorageEpic,
  snGetInstalledAppsEpic,
  snSetInstallAppEpic,
  snSetUnInstallAppEpic,
  snSetAppStatsEpic,
  snGetAppStatsEpic,
  snGetAppCommentsEpic,
  snSetAppCommentEpic,
  // snPersonEpic,
  // logoutPersonEpic,
  snUserProfileEpic,
  snUserPreferencesEpic,
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

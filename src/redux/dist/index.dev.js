"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _reduxObservable = require("redux-observable");

var _reduxDevtoolsExtension = require("redux-devtools-extension");

var _SnLoaderReducer = _interopRequireDefault(require("./action-reducers-epic/SnLoaderReducer"));

var _SnUploadListReducer = _interopRequireDefault(require("./action-reducers-epic/SnUploadListReducer"));

var _SnSelectedHostedAppReducer = _interopRequireDefault(require("./action-reducers-epic/SnSelectedHostedAppReducer"));

var _SnPublishAppReducer = _interopRequireDefault(require("./action-reducers-epic/SnPublishAppReducer"));

var _SnAppStatsReducer = _interopRequireDefault(require("./action-reducers-epic/SnAppStatsReducer"));

var _SnAppStatsEpic = require("./action-reducers-epic/SnAppStatsEpic");

var _SnPublishAppEpic = require("./action-reducers-epic/SnPublishAppEpic");

var _SnShowHostingLinksReducer = _interopRequireDefault(require("./action-reducers-epic/SnShowHostingLinksReducer"));

var _SnUserSessionReducer = _interopRequireDefault(require("./action-reducers-epic/SnUserSessionReducer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import SnPerson from "./sn.person.reducer"
// import SnUserProfile from "./sn.userprofile.reducer"
// import { snUserProfileEpic } from "./sn.userprofile.epic"
// import SnUserPreferences from "./sn.usermasterprofile.reducer"
// import { snUserPreferencesEpic } from "./sn.usermasterprofile.epic"
// import SnMyFollowers from "./sn.myFollowers.reducer"
// import { snMyFollowersEpic } from "./sn.myFollowers.epic"
// import SnMyFollowings from "./sn.myFollowings.reducer"
// import { snMyFollowingsEpic } from "./sn.myFollowings.epic"
var redux = require("redux");

var _require = require("redux-observable"),
    createEpicMiddleware = _require.createEpicMiddleware;

var rootReducer = (0, _redux.combineReducers)({
  snLoader: _SnLoaderReducer["default"],
  userSession: _SnUserSessionReducer["default"],
  // person: SnPerson,
  // snUserProfile: SnUserProfile,
  // snUserPreferences: SnUserPreferences,
  // snMyFollowers: SnMyFollowers,
  // snMyFollowings: SnMyFollowings,
  snUploadListStore: _SnUploadListReducer["default"],
  snPublishedAppsStore: _SnPublishAppReducer["default"],
  snAppStatsStore: _SnAppStatsReducer["default"],
  snSelectedHostedAppStore: _SnSelectedHostedAppReducer["default"],
  snShowHostingLinks: _SnShowHostingLinksReducer["default"]
});
var rootEpic = (0, _reduxObservable.combineEpics)(_SnAppStatsEpic.snSetAppStatsEpic, _SnAppStatsEpic.snGetAppStatsEpic, _SnPublishAppEpic.snGetPublishedAppsEpic, _SnPublishAppEpic.snSetPublishAppEpic, _SnPublishAppEpic.snGetAppCommentsEpic, _SnPublishAppEpic.snSetAppCommentEpic // snPersonEpic,
// logoutPersonEpic,
// snUserProfileEpic,
// snUserPreferencesEpic,
// snMyFollowersEpic,
// snMyFollowingsEpic
);
var observableMiddleware = createEpicMiddleware();
var store = (0, _redux.createStore)(rootReducer, (0, _reduxDevtoolsExtension.composeWithDevTools)(redux.applyMiddleware(observableMiddleware)));
observableMiddleware.run(rootEpic);
var _default = store;
exports["default"] = _default;
import { combineReducers, createStore } from "redux"
import { combineEpics } from "redux-observable"
import { composeWithDevTools } from "redux-devtools-extension"

import SnLoaderReducer from "./sn.loader.reducer"
import SnPerson from "./sn.person.reducer"
import SnUserProfile from "./sn.userprofile.reducer"
import { snUserProfileEpic } from "./sn.userprofile.epic"
import SnUserMasterProfile from "./sn.usermasterprofile.reducer"
import { snUserMasterProfileEpic } from "./sn.usermasterprofile.epic"
import SnMyFollowers from "./sn.myFollowers.reducer"
import { snMyFollowersEpic } from "./sn.myFollowers.epic"
import SnMyFollowings from "./sn.myFollowings.reducer"
import { snMyFollowingsEpic } from "./sn.myFollowings.epic"

const redux = require("redux")
const { createEpicMiddleware } = require("redux-observable")

const rootReducer = combineReducers({
  snLoader: SnLoaderReducer,
  // userSession: SnUserSessionReducer,
  person: SnPerson,
  snUserProfile: SnUserProfile,
  snUserMasterProfile: SnUserMasterProfile,
  snMyFollowers: SnMyFollowers,
  snMyFollowings: SnMyFollowings,
})

const rootEpic = combineEpics(
  // snPersonEpic,
  // logoutPersonEpic,
  snUserProfileEpic,
  snUserMasterProfileEpic,
  snMyFollowersEpic,
  snMyFollowingsEpic
)

const observableMiddleware = createEpicMiddleware()
const store = createStore(
  rootReducer,
  composeWithDevTools(redux.applyMiddleware(observableMiddleware))
)
observableMiddleware.run(rootEpic)

export default store

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserProfileAction = exports.setUserProfileAction = void 0;

var _SnActionConstants = require("../SnActionConstants");

var _ = _interopRequireDefault(require(".."));

var _SnConstants = require("../../utils/SnConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var setUserProfileAction = function setUserProfileAction(userAppProfile) {
  if (userAppProfile == null) {
    _SnConstants.BROWSER_STORAGE.removeItem(_SnConstants.STORAGE_USER_APP_PROFILE_KEY);
  } else {
    _SnConstants.BROWSER_STORAGE.setItem(_SnConstants.STORAGE_USER_APP_PROFILE_KEY, JSON.stringify(userAppProfile));
  }

  return {
    type: _SnActionConstants.ACT_TY_SET_USER_PROFILE,
    payload: userAppProfile
  };
}; // This method is called during login and on Profile Page


exports.setUserProfileAction = setUserProfileAction;

var getUserProfileAction = function getUserProfileAction(session) {
  session = session != null ? session : _["default"].getState().userSession;
  return {
    type: _SnActionConstants.ACT_TY_GET_USER_PROFILE,
    payload: session
  };
};

exports.getUserProfileAction = getUserProfileAction;
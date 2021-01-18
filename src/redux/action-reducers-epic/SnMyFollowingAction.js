import {
  ACT_TY_SET_MY_FOLLOWINGS,
  ACT_TY_GET_MY_FOLLOWINGS,
} from "../SnActionConstants"

export const setMyFollowingsAction = (myFollowingsList) => ({
  type: ACT_TY_SET_MY_FOLLOWINGS,
  payload: myFollowingsList,
})
// Pubkey will be null for myfollowings, If you need some other users following pass pubkey  of that user
export const getMyFollowingsAction = (pubkey) => ({
  type: ACT_TY_GET_MY_FOLLOWINGS,
  payload: pubkey,
})

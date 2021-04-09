import {
  ACT_TY_SET_MY_FOLLOWERS,
  ACT_TY_GET_MY_FOLLOWERS,
} from "../SnActionConstants"

export const setMyFollowersAction = (myFollowersList) => ({
  type: ACT_TY_SET_MY_FOLLOWERS,
  payload: myFollowersList,
})
// Pubkey will be null for myfollowers, If you need some other users followers pass pubkey  of that user
export const getMyFollowersAction = (pubkey) => ({
  type: ACT_TY_GET_MY_FOLLOWERS,
  payload: pubkey,
})

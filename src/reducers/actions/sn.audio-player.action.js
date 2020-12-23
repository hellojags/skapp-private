import {
  ACT_TY_ADD_ITEM_IN_AUDIO_LIST,
  ACT_TY_SET_AUDIO_LIST,
  ACT_TY_CHANGE_AUDIO_STATUS,
  ACT_TY_UPDATE_CURRENT_AUDIO,
} from "./sn.action.constants"

export const addAudioObjectAction = (audioObj) => ({
  type: ACT_TY_ADD_ITEM_IN_AUDIO_LIST,
  payload: audioObj,
})

export const setAudioListAction = (audioObjArray) => ({
  type: ACT_TY_SET_AUDIO_LIST,
  payload: audioObjArray,
})

export const updateCurrentAudioAction = (audioObj) => ({
  type: ACT_TY_UPDATE_CURRENT_AUDIO,
  payload: audioObj,
})

export const setChangedAudioStatusAction = (boolean) => ({
  type: ACT_TY_CHANGE_AUDIO_STATUS,
  payload: boolean,
})

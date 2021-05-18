import {
    ACT_TY_SET_STORAGE,
    EPIC_TY_SET_STORAGE,
    EPIC_TY_GET_STORAGE,
    EPIC_TY_DELETE_STORAGE,
    EPIC_TY_EDIT_STORAGE
} from "../SnActionConstants"

export const setStorageEpic = (data) => {
    return {
        type: EPIC_TY_SET_STORAGE,
        payload: data,
    }
}

export const setDeleteStorageEpic = (data) => {
    return {
        type: EPIC_TY_DELETE_STORAGE,
        payload: data,
    }
}

export const setEditStorageEpic = (data) => {
    return {
        type: EPIC_TY_EDIT_STORAGE,
        payload: data,
    }
}

export const setStorageAction = (data) => {
    return {
        type: ACT_TY_SET_STORAGE,
        payload: data,
    }
}

export const getStorageAction = () => ({
    type: EPIC_TY_GET_STORAGE,
    payload: null,
  })
  
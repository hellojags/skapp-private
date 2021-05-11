import {
    ACT_TY_SET_DOMAIN,
    EPIC_TY_SET_DOMAIN,
    EPIC_TY_GET_DOMAIN,
    EPIC_TY_DELETE_DOMAIN,
    EPIC_TY_EDIT_DOMAIN
} from "../SnActionConstants"

export const setDomainEpic = (data) => {
    return {
        type: EPIC_TY_SET_DOMAIN,
        payload: data,
    }
}

export const setDeleteDomainEpic = (data) => {
    return {
        type: EPIC_TY_DELETE_DOMAIN,
        payload: data,
    }
}

export const setEditDomainEpic = (data) => {
    return {
        type: EPIC_TY_EDIT_DOMAIN,
        payload: data,
    }
}

export const setDomainAction = (data) => {
    return {
        type: ACT_TY_SET_DOMAIN,
        payload: data,
    }
}

export const getDomainsAction = () => ({
    type: EPIC_TY_GET_DOMAIN,
    payload: null,
  })
  
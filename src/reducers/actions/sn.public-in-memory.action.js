import { ACT_TY_SET_PUBLIC_IN_MEMORY } from "./sn.action.constants"

export const setPublicInMemory = (hash) => ({
  type: ACT_TY_SET_PUBLIC_IN_MEMORY,
  payload: hash,
})

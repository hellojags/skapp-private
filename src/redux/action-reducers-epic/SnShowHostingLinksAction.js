import { ACT_TY_CHANGE_SHOW_HOSTING_LINKS_STATE } from "../SnActionConstants";

export const setShowHostingLinks = (newLoaderState) => ({
  type: ACT_TY_CHANGE_SHOW_HOSTING_LINKS_STATE,
  payload: newLoaderState,
})

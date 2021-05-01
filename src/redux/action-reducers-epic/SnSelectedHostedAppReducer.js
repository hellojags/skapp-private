import { ACT_TY_SET_SELECTED_HOSTED_APP } from "../SnActionConstants";
import { STORAGE_SELECTED_HOSTED_APP_KEY, BROWSER_STORAGE } from "../../utils/SnConstants";

export default (state = null, action) => {
  switch (action.type) {
    case ACT_TY_SET_SELECTED_HOSTED_APP:
      return action.payload
    default:
      if (state == null) {
        state = BROWSER_STORAGE.getItem(STORAGE_SELECTED_HOSTED_APP_KEY);
      }
      return state;
  }
}

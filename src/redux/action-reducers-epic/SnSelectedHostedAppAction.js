import { BROWSER_STORAGE, STORAGE_SELECTED_HOSTED_APP_KEY } from "../../utils/SnConstants";
import { ACT_TY_SET_SELECTED_HOSTED_APP } from "../SnActionConstants";

export const setSelectedHostedApp = (appId) => {
    BROWSER_STORAGE.setItem(STORAGE_SELECTED_HOSTED_APP_KEY, appId);
    return {
        type: ACT_TY_SET_SELECTED_HOSTED_APP,
        payload: appId
    };
};
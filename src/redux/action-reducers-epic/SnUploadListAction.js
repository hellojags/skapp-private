import { ACT_TY_SET_UPLOAD_LIST } from "../SnActionConstants";


export const setUploadList = (list) => {
    return {
        type: ACT_TY_SET_UPLOAD_LIST,
        payload: list
    };
};
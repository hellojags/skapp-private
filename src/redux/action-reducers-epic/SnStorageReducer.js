import { ACT_TY_SET_STORAGE } from "../SnActionConstants"

let initState = {
  storages: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_STORAGE:
      return { ...state, storages: action.payload }
    default:
      return state
  }
}

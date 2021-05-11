import { ACT_TY_SET_DOMAIN } from "../SnActionConstants"

let initState = {
    domains: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case ACT_TY_SET_DOMAIN:
        return {...state, domains : action.payload}
    default:
      return state
  }
}

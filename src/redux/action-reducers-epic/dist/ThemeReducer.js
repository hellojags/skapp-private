const Darkmode;
export default (state = null, action) => {
    switch (action.type) {
      case Darkmode:
        return action.payload
      default:
        return state
    }
  }
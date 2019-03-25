function User(state = {}, action) {
  switch (action.type) {
    case 'PERMISSIONS_USER_INIT': {
      let newState
      if (action.applications === undefined) {
        newState = {
          ...state,
          user: action.user,
        }
      } else {
        newState = {
          ...state,
          user: action.user,
          applications: action.applications,
        }
      }
      return Object.assign({}, state, newState)
    }
    default:
      return Object.assign({}, state)
  }
}

export default User

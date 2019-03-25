function Application(state = {}, action) {
  switch (action.type) {
    case 'PERMISSIONS_APPLICATION_INIT':
      var newState = {}

      if (action.data !== undefined) {
        newState.permissions = action.data
      }

      if (action.users !== undefined) {
        newState.users = action.users
      }

      return Object.assign({}, state, newState)
    default:
      return state
  }
}

export default Application

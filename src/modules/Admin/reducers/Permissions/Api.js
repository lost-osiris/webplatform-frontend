function Api(state = {}, action) {
  switch (action.type) {
    case 'PERMISSIONS_API_INIT':
      var newState = {
        api: action.api,
      }
      return Object.assign({}, state, newState)
    default:
      return Object.assign({}, state)
  }
}

export default Api

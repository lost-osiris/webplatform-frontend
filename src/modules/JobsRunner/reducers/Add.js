function AddReducer(state = {}, action) {
  switch (action.type) {
    case 'JOBRUNNER_ADD_INIT':
      var newState = {
        data: action.data,
      }
      return Object.assign({}, state, newState)
    default:
      return state
  }
}
export default AddReducer

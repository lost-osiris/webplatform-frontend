function JobReducer(state = {}, action) {
  let newState
  switch (action.type) {
    case 'JOBRUNNER_JOB_INIT':
      newState = {}

      if (action.job != undefined) {
        newState.job = action.job
      }

      if (action.api != undefined) {
        newState.api = action.api
      }

      return Object.assign({}, state, newState)

    case 'JOBRUNNER_JOB_RESULTS':
      newState = {
        results: action.data,
      }
      return Object.assign({}, state, newState)

    default:
      return state
  }
}

export default JobReducer

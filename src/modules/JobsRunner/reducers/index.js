import { combineReducers } from 'redux'
import AddReducer from '../modules/Add/reducers'
import JobReducer from '../modules/Job/reducers'

const JobRunnerReducer = function(state = {}, action) {
  let newState = {}
  switch (action.type) {
    case 'JOBRUNNER_MAIN_INIT': {
      if (state.jobs == undefined) {
        newState.jobs = {}
      } else {
        newState.jobs = state.jobs
      }

      newState.jobs = action.data
      newState.currentStatus = action.status

      return Object.assign({}, state, newState)
    }
    case 'JOBRUNNER_MAIN_CHANGE_TAB': {
      newState.currentStatus = action.status

      return Object.assign({}, state, newState)
    }
    default:
      return state
  }
}

const JobRunner = combineReducers({
  main: JobRunnerReducer,
  add: AddReducer,
  job: JobReducer,
})
//

export default JobRunner

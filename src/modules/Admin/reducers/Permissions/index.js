import { combineReducers } from 'redux'
import Api from '../modules/Api/reducers'
import User from '../modules/User/reducers'
import Application from '../modules/Application/reducers'

const PermissionsReducer = function(state = {}, action) {
  switch (action.type) {
    case 'PERMISSIONS_MAIN_INIT':
      var newState = {
        data: {
          ...state.data,
          ...action.data,
        },
      }

      return Object.assign({}, state, newState)

    case 'PERMISSIONS_MAIN_CHANGE_TAB':
      return Object.assign({}, state, {
        tab: action.tab,
      })

    default:
      return state
  }
}

const Permissions = combineReducers({
  main: PermissionsReducer,
  api: Api,
  user: User,
  application: Application,
})

export default Permissions

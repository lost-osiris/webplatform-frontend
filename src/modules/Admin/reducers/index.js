import { combineReducers } from 'redux'
import LogsReducer from '../modules/Logs/reducers'

const Admin = combineReducers({
  logs: LogsReducer
})

export default Admin

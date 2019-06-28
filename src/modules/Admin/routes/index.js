import Ahyder from './Children/Ahyder'
import Mowens from './Children/Mowens'
import ChangeUser from './Children/ChangeUser'
import TestApi from './Children/TestApi'
import Permissions from './Children/Permissions'
import Logs from './Children/Logs'
import Settings from './Children/Settings'
// import Children from './Children'
import { combineReducers } from 'redux'

// import SettingsReducer from '~/modules/Admin/reducers/Settings'
// import PermissionsReducer from '~/modules/Admin/reducers/Permissions'
// import LogsReducer from '~/modules/Admin/reducers/Logs'

var route = {
  route: {
    path: '/admin',
    children:
    [
      Ahyder,
      Mowens,
      ChangeUser,
      TestApi,
      ...Permissions,
      ...Logs,
      ...Settings,
    ]
    // [...Children]
  },
}

export default route

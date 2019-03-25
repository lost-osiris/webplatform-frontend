import ChangeUser from './ChangeUser'
import Permissions from './Permissions'
import Logs from './Logs'
import Settings from './Settings'
import TestApi from './TestApi'

export default [
  ChangeUser,
  TestApi,
  ...Logs,
  ...Permissions,
  ...Settings,
]

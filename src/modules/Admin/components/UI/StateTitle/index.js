import Permissions from './Permissions'
import Settings from './Settings'
import Logs from './Logs'

const ChangeUser = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './ChangeUser')
const TestApi = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './TestApi')
const User = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './User')

export { Logs, ChangeUser, Permissions, TestApi, Settings, User }

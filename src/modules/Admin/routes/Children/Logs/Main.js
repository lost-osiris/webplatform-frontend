import AdminLogs from '~/modules/Admin/modules/Logs/containers/LogsContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/logs',
    exact: true,
    component: AdminLogs,
  },
  ui: {
    stateTitle: StateTitle.Logs.Main,
  }
}

export default route

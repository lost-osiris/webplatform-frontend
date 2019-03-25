import AdminLog from '~/modules/Admin/modules/Logs/modules/Log/containers/MainContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/logs/id/:id',
    exact: true,
    component: AdminLog,
  },
  ui: {
    stateTitle: StateTitle.Logs.Log,
  },
}

export default route

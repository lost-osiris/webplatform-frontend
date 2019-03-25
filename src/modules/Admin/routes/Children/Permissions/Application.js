import AdminPermissionsApplication from '~/modules/Admin/containers/Permissions/Application/MainContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/permissions/application/:name',
    exact: true,
    component: AdminPermissionsApplication,
  },
  ui: {
    stateTitle: StateTitle.Permissions.Application,
  }
}

export default route

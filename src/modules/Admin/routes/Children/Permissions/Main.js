import AdminPermissions from '~/modules/Admin/modules/Permissions/containers/MainContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/permissions',
    exact: true,
    component: AdminPermissions,
  },
  ui: {
    stateTitle: StateTitle.Permissions.Main,
  }
}

export default route

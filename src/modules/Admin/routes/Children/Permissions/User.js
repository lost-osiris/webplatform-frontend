import AdminPermissionsUser from '~/modules/Admin/modules/Permissions/modules/User/containers/MainContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/permissions/user/:uid',
    exact: true,
    component: AdminPermissionsUser,
  },
  ui: {
    stateTitle: StateTitle.Permissions.User,
  }
}

export default route

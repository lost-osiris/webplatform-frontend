import AdminPermissionsApi from '~/modules/Admin/modules/Permissions/modules/Api/containers/MainContainer'
import * as StateTitle from '../../StateTitle'

var route = {
  route: {
    path: '/permissions/api/:safeName',
    exact: true,
    component: AdminPermissionsApi,
  },
  ui: {
    stateTitle: StateTitle.Permissions.Api,
  },
  mapStateToProps: {
    stateTitle: state => ({
      api: state.permissions.api,
    })
  },
}

export default route

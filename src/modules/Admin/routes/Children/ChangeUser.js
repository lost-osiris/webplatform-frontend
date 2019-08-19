import ChangeUser from '~/modules/Admin/containers/ChangeUserContainer'
import UI from '../../components/UI'

let changeUserContainer = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '../../containers/ChangeUserContainer')

var route = {
  route: {
    path: '/change-user',
    component: ChangeUser,
  },
  ui: {
    stateTitle: UI.StateTitle.ChangeUser,
    content: changeUserContainer
  },
}

export default route

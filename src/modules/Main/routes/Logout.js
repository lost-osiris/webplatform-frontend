import Logout from '../components/Views/Logout'
import * as UI from '../components/UI'

var route = {
  route: {
    path: '/logout',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Logout,
    content: Logout,
  },
}

export default route

import ChangeUser from '~/modules/Admin/containers/ChangeUserContainer'
import * as StateTitle from '../StateTitle'

var route = {
  route: {
    path: '/change-user',
    component: ChangeUser,
  },
  ui: {
    stateTitle: StateTitle.ChangeUser,
  }
}

export default route

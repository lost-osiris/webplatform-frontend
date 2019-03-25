import EditJob from '~/modules/JobRunner/modules/Job/containers/EditContainer'
import * as StateTitle from '../StateTitle'
import * as Nav from '../Nav'

var route = {
  route: {
    path: '/add',
    component: EditJob,
  },
  ui: {
    stateTitle: StateTitle.Add,
    appNav: Nav.Main,
  }
}

export default route

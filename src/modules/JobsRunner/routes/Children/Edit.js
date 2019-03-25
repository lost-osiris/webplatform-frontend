import EditJob from '~/modules/JobRunner/modules/Job/containers/EditContainer'
// import EditJob from '~/modules/JobRunner/modules/Edit/containers/EditContainer'
import * as StateTitle from '../StateTitle'
import * as Nav from '../Nav'

var route = {
  route: {
    path: '/edit/:id',
    component: EditJob,
  },
  ui: {
    stateTitle: StateTitle.Edit,
    appNav: Nav.Main,
  }
}

export default route

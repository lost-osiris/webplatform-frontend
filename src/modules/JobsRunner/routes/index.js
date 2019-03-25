import Jobs from '~/modules/JobRunner/containers/MainContainer'
import Children from './Children'
import * as StateTitle from './StateTitle'
import * as Nav from './Nav'

var route = {
  route: {
    path: '/jobs',
    component: Jobs,
    exact: true,
    children: Children,
  },
  ui: {
    stateTitle: StateTitle.Main,
    appNav: Nav.Main,
      // search: Search.Main,
  }
}

export default route

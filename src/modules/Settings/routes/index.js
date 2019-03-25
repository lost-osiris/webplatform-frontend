import Settings from '~/modules/Settings/containers/SettingsContainer'
import * as StateTitle from './StateTitle'
// import * as Nav from './Nav'
// import * as Search from './Search'

var route = {
  route: {
    path: '/settings',
    component: Settings,
    exact: true,
  },
  ui: {
    stateTitle: StateTitle.Main,
      // search: Search.Main,
  }
}

export default route

import Template from '~/modules/Admin/modules/SettingsTemplates/containers/MainContainer'
import * as StateTitle from '../../StateTitle'
import * as Nav from '../../Nav'

const route = {
  route: {
    path: '/settings',
    component: Template,
    exact: true,
  },
  ui: {
    stateTitle: StateTitle.Settings.Main,
    appNav: Nav.Settings.Main,
  },
}

export default route

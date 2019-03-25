import AddTemplate from '~/modules/Admin/modules/SettingsTemplates/containers/AddContainer'
import * as StateTitle from '../../StateTitle'
import * as Nav from '../../Nav'

const route = {
  route: {
    path: '/settings/templates/add',
    component: AddTemplate,
    exact: true,
  },
  ui: {
    stateTitle: StateTitle.Settings.Main,
    appNav: Nav.Settings.Main,
  },
}

export default route

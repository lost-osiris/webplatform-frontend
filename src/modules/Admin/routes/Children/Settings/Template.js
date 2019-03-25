import TemplateInfo from '~/modules/Admin/modules/SettingsTemplates/containers/InfoContainer'
import * as StateTitle from '../../StateTitle'
import * as Nav from '../../Nav'

const route = {
  route: {
    path: '/settings/templates/name/:name',
    component: TemplateInfo,
    exact: true,
  },
  ui: {
    stateTitle: StateTitle.Settings.Main,
    appNav: Nav.Settings.Main,
  },
}

export default route

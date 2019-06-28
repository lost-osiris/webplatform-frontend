import * as Nav from '../../../components/UI/Nav'
import UI from '../../../components/UI'
import SettingsReducer from '~/modules/Admin/reducers/Settings'

let mainContainer = () => import('../../../containers/SettingsTemplates/MainContainer')

const route = {
  route: {
    path: '/settings',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Settings.Main,
    content: mainContainer,
    appNav: Nav.Settings.Main,
  },
  reducer: {
    name: 'settings',
    data: SettingsReducer
  },
  mapStateToProps: (state) => {
    return {
      templates: state.settings.templates
    }
  },
  api: (utils) => {
    const api = {
      path: 'settings.templates.list',
    }
    return utils.request(api).then(data => {
      return utils.dispatch('TEMPLATES_INIT', {data: data}, 'settings')
    })
  }
}

export default route

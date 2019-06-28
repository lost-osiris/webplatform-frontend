import * as Nav from '../../../components/UI/Nav'
import UI from '../../../components/UI'
import SettingsReducer from '~/modules/Admin/reducers/Settings'

let infoContainer = () => import('../../../containers/SettingsTemplates/InfoContainer')

const route = {
  route: {
    path: '/settings/templates/name/:name',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Settings.Main,
    content: infoContainer,
    appNav: Nav.Settings.Main,
  },
  reducer: {
    name: 'settings',
    data: SettingsReducer
  },
  mapStateToProps: (state) => {
    return {
      template: state.settings.template
    }
  },
  api: (utils, match) => {
    const api = {
      path: 'settings.templates.get',
      data: {
        name: match.params.name,
      }
    }
    return utils.request(api).then(data => {
      return utils.dispatch('TEMPLATE', {data: data}, 'settings')
    })
  }
}

export default route

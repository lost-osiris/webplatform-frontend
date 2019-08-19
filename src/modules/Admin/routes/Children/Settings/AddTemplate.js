import * as Nav from '../../../components/UI/Nav'
import UI from '../../../components/UI'
import SettingsReducer from '~/modules/Admin/reducers/Settings'

let templateFormContainer = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '../../../containers/SettingsTemplates/TemplateFormContainer')

const route = {
  route: {
    path: '/settings/templates/add',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Settings.Main,
    content: templateFormContainer,
    appNav: Nav.Settings.Main,
  },
  reducer: {
    name: 'settings',
    data: SettingsReducer
  },
  mapStateToProps: (state) => {
    return {
      applications: state.settings.applications
    }
  },
  api: (utils) => {
    const api = {
      path: '/applications/list'
    }

    return utils.request(api).then(data => {
      return utils.dispatch('ADD', {data: data}, 'settings')
    })

  }
}

export default route

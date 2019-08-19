let settingsContainer = () => import(/* webpackChunkName: "Settings", webpackPrefetch: true */ '~/modules/Settings/containers/SettingsContainer')
import * as StateTitle from '../components/UI/StateTitle'
// import * as Nav from './Nav'
// import * as Search from './Search'

var route = {
  route: {
    path: '/settings',
    exact: true,
  },
  ui: {
    stateTitle: StateTitle.Main,
    content: settingsContainer 
  },
  mapStateToProps: (state) => {
    const settings = state.dashboard.settings
    return {
      settings: settings.settings,
      templates: settings.templates
    }
  },
  api: (utils) => {
    const api = {
      path: 'settings.build'
    }

    return utils.request(api).then(data => {
      const get = {
        path: 'settings.get',
        data: {
          output: 'uid'
        }
      }

      return utils.request(get).then(settings => {
        return utils.dispatch('DASHBOARD_SETTINGS', {data: {templates: data, settings}})
      })
    })
  }
}

export default route

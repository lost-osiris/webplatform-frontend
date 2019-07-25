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
      template: state.settings.template,
      applications: state.settings.applications
    }
  },
  api: (utils, match) => {
    const api = {
      templates: {
        path: 'settings.templates.get',
        data: {
          name: match.params.name,
        }
      },
      applications: {
        path: '/applications/list'
      }
    }
    // return utils.request(api).then(data => {
    //   return utils.dispatch('TEMPLATE', {data: data}, 'settings')
    // })
    return utils.request(api).then(async (data) => {
      let  templates = await data.templates
      let applications = await data.applications

      utils.dispatch('TEMPLATE', {data: templates}, 'settings')
      return utils.dispatch('ADD', {data: applications}, 'settings')
    })
  }
}

export default route

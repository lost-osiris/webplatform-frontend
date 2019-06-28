import UI from '../../../components/UI'
import PermissionsReducer from '~/modules/Admin/reducers/Permissions'

let apiContainer = () => import('../../../containers/Permissions/Api/MainContainer')
var route = {
  route: {
    path: '/permissions/api/:safeName',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Permissions.Api,
    content: apiContainer
  },
  reducer: {
    name: 'permissions',
    data: PermissionsReducer 
  },

  mapStateToProps: (state) => {
    return (
      {
        ...state.permissions.main,
        ...state.permissions.api
      }
    )
  },

  api: (utils, match) => {
    const api = {
      path: 'permissions.setup'
    }

    return utils.request(api).then((data) => {
      var api = data.apis.find((val) => {
        if (match.params.safeName == val.safe_name) {
          return val
        }
      })

      utils.dispatch('INIT', {data: data}, 'permissions.main')
      utils.dispatch('INIT', {api: api}, 'permissions.api')
    })

  }
}

export default route

import UI from '../../../components/UI'
import PermissionsReducer from '~/modules/Admin/reducers/Permissions'

let applicationContainer = () => import('../../../containers/Permissions/Application/MainContainer')

var route = {
  route: {
    path: '/permissions/application/:name',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Permissions.Application,
    content: applicationContainer
  },
  reducer: {
    name: 'permissions',
    data: PermissionsReducer 
  },

  mapStateToProps: (state) => {
    let stateObj = state.permissions.application

    return {
      permissions: stateObj.permissions,
      users: stateObj.users
    }
  },

  api: (utils, match) => {
    const api = {
      permissions: {
        path: 'permissions.applications.get',
        data: {
          application: match.params.name
        }
      },
      users: {
        path: 'users.list'
      }
    }


    return utils.request(api).then(data => {
      return data.permissions.then(permissions => {
        return data.users.then(users => {
          let action = { permissions, users }

          utils.dispatch('INIT', action, 'permissions.application')

          return action
        })
      })
    })
  }
}

export default route

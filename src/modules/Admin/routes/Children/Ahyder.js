import UI from '~/modules/Admin/components/UI/'

var route = {
  route: {
    path: '/ahyder',
  },
  ui: {
    stateTitle: UI.StateTitle.User,
    content: UI.Content.Ahyder,
  },
  mapStateToProps: (state) => {
    let stateObj = state.permissions.application

    return {
      users: stateObj.users
    }
  },
  // api: (utils) => {
  //   let api = {
  //     path: 'se.setup',
  //   }
  //
  //   return utils.request(api).then((data) => {
  //     return utils.dispatch('SETUP', {data: data}, 'se.main')
  //   })
  // },
  // mapStateToProps: (state) => {
  //   return {
  //     data: state.se.main.setup
  //   }
  // }
  api: (utils, match) => {
    const api = {
      path: 'users.list',
    }

    return utils.request(api).then(data => {
      let action = {}
      action.users = data

      utils.dispatch('INIT', action, 'permissions.application')

      return action
    })
  }
}

export default route

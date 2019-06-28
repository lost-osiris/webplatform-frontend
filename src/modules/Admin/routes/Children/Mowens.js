import UI from '~/modules/Admin/components/UI/'

var route = {
  route: {
    path: '/mowens',
  },
  ui: {
    stateTitle: UI.StateTitle.User,
    content: UI.Content.Mowens,
  },
  api: (utils) => {
    let api = {
      path: 'se.setup',
    }

    return utils.request(api).then((data) => {
      return utils.dispatch('SETUP', {data: data}, 'se.main')
    })
  },
  mapStateToProps: (state) => {
    return {
      data: state.se.main.setup
    }
  }
}

export default route

import UI from '../components/UI'

var route = {
  route: {
    path: '/',
    exact: true,
  },
  ui: {
    stateTitle: UI.StateTitle.Home,
    content: UI.Content.Home,
    search: UI.Search.Default
  },
}

export default route

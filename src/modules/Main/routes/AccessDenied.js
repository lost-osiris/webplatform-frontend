import AccessDenied from '../components/Views/AccessDenied'

import * as UI from '../components/UI'

var route = {
  route: {
    path: '/access-denied',
  },
  ui: {
    stateTitle: UI.StateTitle.AccessDenied,
    content: AccessDenied
  }
}

export default route

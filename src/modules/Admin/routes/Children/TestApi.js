import TestAPI from '~/modules/Admin/modules/TestApi/containers/MainContainer'
import * as StateTitle from '../StateTitle'

var route = {
  route: {
    path: '/test-api/:apiPath?',
    component: TestAPI,
  },
  ui: {
    stateTitle: StateTitle.TestApi
  }
}

export default route

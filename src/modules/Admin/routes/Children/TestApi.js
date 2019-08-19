import TestAPI from '~/modules/Admin/containers/TestApi/MainContainer'
import UI from '../../components/UI'
import { Utils } from 'webplatform-ui'

let testApiContainer = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '../../containers/TestApi/MainContainer')
let utils = new Utils()

var route = {
  route: {
    path: '/test-api/:apiPath?',
    component: TestAPI,
  },
  ui: {
    stateTitle: UI.StateTitle.TestApi,
    content: testApiContainer
  },

  mapStateToProps: (state) => {
    let stateObj = state.permissions.application

    return {
      permissions: stateObj.permissions,
      users: stateObj.users,
      apis: utils.getSystemInfo().modules
    }
  },

}

export default route

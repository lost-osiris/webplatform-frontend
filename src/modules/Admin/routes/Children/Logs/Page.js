// import AdminLogs from '~/modules/Admin/modules/Logs/containers/LogsContainer'
// import * as StateTitle from '../../StateTitle'
import UI from '../../../components/UI'
import LogsReducer from '~/modules/Admin/reducers/Logs'
let logsContainer = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '../../../containers/Logs/Main')

var route = {
  route: {
    path: '/logs/page/:page',
    exact: true,
    // component: AdminLogs,
  },

  ui: {
    stateTitle: UI.StateTitle.Logs.Main,
    content: logsContainer
  },

  reducer: {
    name: 'logs',
    data: LogsReducer
  },

  mapStateToProps: (state) => {
    return {
      data: state.logs.searchResults
    }
  },
}

export default route

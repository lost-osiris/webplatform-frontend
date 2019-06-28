// import AdminLogs from '~/modules/Admin/modules/Logs/containers/LogsContainer'
// import * as StateTitle from '../../StateTitle'
import UI from '../../../components/UI'
let mainContainer = () => import('../../../containers/Logs/Main')
import LogsReducer from '~/modules/Admin/reducers/Logs'

var route = {
  route: {
    path: '/logs',
    exact: true,
    // component: AdminLogs,
  },
  ui: {
    stateTitle: UI.StateTitle.Logs.Main,
    content: mainContainer
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

import UI from '../../../components/UI'
import LogsReducer from '~/modules/Admin/reducers/Logs'
let logContainer = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '../../../containers/Logs/Logs')

var route = {
  route: {
    path: '/logs/id/:id',
    exact: true,
    // component: AdminLog,
  },

  ui: {
    stateTitle: UI.StateTitle.Logs.Log,
    content: logContainer
  },

  reducer: {
    name: 'logs',
    data: LogsReducer
  },

  mapStateToProps: (state) => {
    return {log: state.logs.log}
  },

  api: (utils, match) => {
    let id = match.params.id
    const log = utils.getState().logs.log

    if (!log || log.id !== id) {
      const api = {
        path: 'logging.get',
        data: {
          id: id,
        }
      }

      utils.request(api).then(data => {
        utils.dispatch('INIT', {log: data}, 'logs')
      })
    }
  }
}

export default route

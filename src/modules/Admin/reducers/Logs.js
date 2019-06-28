export default function AdminLogsReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGS_INIT': {
      let { log } = action
      return Object.assign({}, state, {
        log: log,
      })
    }
    case 'LOGS_SEARCH': {
      const { start, end, module, uid, failuresOnly, limit } = action.data
      return {
        start,
        end,
        module,
        uid,
        failuresOnly,
        limit,
      }
    }
    case 'LOGS_SEARCH_RESULTS': {
      let { logs } = action
      return Object.assign({}, state, {
        searchResults: logs,
      })
    }
    default:
      return state
  }
}

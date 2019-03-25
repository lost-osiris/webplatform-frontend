export default function AdminLogsReducer(state = {}, action) {
  switch (action.type) {
    case 'ADMIN_LOGS_SEARCH': {
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
    case 'ADMIN_LOGS_INIT': {
      const { data } = action
      return Object.assign({}, state, {
        results: data,
      })
    }
    default:
      return state
  }
}

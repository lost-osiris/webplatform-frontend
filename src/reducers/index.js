import { combineReducers } from 'redux'

const initialState = {
  location: null,
  sideNavToggled: false,
}

const DashboardReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'DASHBOARD_LOADED': {
      let newState = {}

      if (action.user != undefined) {
        newState.user = action.user
      }

      if (action.systemInfo != undefined) {
        newState.systemInfo = action.systemInfo
      }

      return Object.assign({}, state, newState)
    }

    case 'API_SUCCESS': {
      let newState = {
        loading: {...state.loading},
      }
      if (state.error != undefined) {
        newState.error = state.error
      }

      newState.loading[action.route] = false

      return Object.assign({}, state, newState)

    }

    case 'API_FAILURE': {
      let newState = {
        errors: [],
      }
      if (state.loading != undefined) {
        newState.loading = state.loading
      }
      if (state.error != undefined) {
        newState.error = state.error
      }

      newState.loading[action.route] = false

      newState.errors.push({
        route: action.route,
        message: action.error,
        status: action.status,
        path: action.path,
      })

      return Object.assign({}, state, newState)
    }
    case 'API_FAILURE_THROWN': {
      var newState = {
        errors: [...state.errors],
      }

      newState.errors.pop(action.index)

      return Object.assign({}, state, newState)
    }


    case 'API_REQUESTED': {
      let newState = {
        // loading: {},
        loading: {...state.loading},
      }

      newState.loading[action.route] = true
      return Object.assign({}, state, newState)

    }

    case 'DASHBOARD_TOGGLE_SIDENAV': {
      let newState = {}

      if (!state.sideNavToggled || state.sideNavToggled == undefined) {
        newState.sideNavToggled = true
      } else {
        newState.sideNavToggled = false
      }

      return Object.assign({}, state, newState)
    }

    case 'DASHBOARD_TOGGLE_SIDENAV_OFF': {
      return Object.assign({}, state, {
        sideNavToggled: false
      })
    }

    case 'DASHBOARD_TOGGLE_SEARCH': {
      let newState = {}

      if (!state.searchToggled || state.searchToggled == undefined) {
        newState.searchToggled = true
      } else {
        newState.searchToggled = false
      }

      return Object.assign({}, state, newState)
    }

    case 'DASHBOARD_AUTOCOMPLETE': {
      let newState = {
        autocomplete: action.data,
      }

      return Object.assign({}, state, newState)
    }

    case 'DASHBOARD_INIT_ROUTE': {
      let newState = {
        matchParams: action.matchParams,
      }

      return Object.assign({}, state, newState)
    }

    case 'DASHBOARD_SETTINGS': {
      let newState = {
        settings: action.data,
      }

      return Object.assign({}, state, newState)
    }

    default: return state
  }
}

const staticReducers = {
  dashboard: DashboardReducer,
}

export default staticReducers

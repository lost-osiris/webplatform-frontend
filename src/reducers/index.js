import { combineReducers } from 'redux'

import findsbr from '~/modules/Findsbr/reducers'
// import dashboards from '../modules/Dashboards/reducers'
import se from '~/modules/SupportExceptions/reducers'
// import bzcompliance from '~/modules/BzCompliance/reducers'
// import apiinfo from '~/modules/Info/Api/reducers'
// import jobrunner from '~/modules/JobRunner/reducers'
// import permissions from '~/modules/Admin/modules/Permissions/reducers'
// import logs from '~/modules/Admin/modules/Logs/reducers'
// import products from '~/modules/Products/reducers'
// import rp from '~/modules/ReleasePlanning/reducers'

const initialState = {
  location: null,
  sideNavToggled: false,
}

const dashboard = function(state = initialState, action) {
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

const rootReducer = combineReducers({
  dashboard,
  findsbr,
  // dashboards,
  se,
  // bzcompliance,
  // apiinfo,
  // jobrunner,
  // permissions,
  // logs,
  // products,
  // rp,
  // router: routerReducer,
})

export default rootReducer

import { combineReducers } from 'redux'
import _ from 'lodash'

const initialState = {
  location: null,
  sideNavToggled: false,
  form: {
    counter: 0,
  }
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

    case 'FORM_INIT': {
      let newState = {
        form: {...state.form}
      }

      if (action.name) {
        newState.form[action.name] = action.form
        newState.form[action.name].errors = {} 
      } else {
        newState.form[state.form.counter] = {
          value: null,
          errors: {}
        }
        newState.form.counter++ 
      }

      return Object.assign({}, state, newState)
    }

    case 'FORM_VALUE_UPDATE': {
      let newState = {
        form: {...state.form}
      }

      if (action.id) {
        newState.form[action.name][action.id] = action.value
      } else {
        newState.form[action.name].value = action.value
      }
      
      return Object.assign({}, state, newState)
    }

    case 'FORM_ERROR': {
      let newState = {
        form: {...state.form}
      }

      let errors = {}
      _.forEach(action.errors, (value, key) => {
        errors[key] = value
      })

      newState.form[action.name].errors = errors
      
      return Object.assign({}, state, newState)
    }
    
    case 'FORM_REMOVE': {
      let newState = {
        form: {...state.form}
      }

      delete newState.form[action.name]      
      
      return Object.assign({}, state, newState)
    }

    default: return state
  }
}

const staticReducers = {
  dashboard: DashboardReducer,
}

export default staticReducers

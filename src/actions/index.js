import axios from 'axios'
import Cookies from 'universal-cookie'
import Qs from 'qs'
import moment from 'moment-timezone'

/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD'

export function updateLocation(method) {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args }
  })
}

export function dashboardLoaded(user, systemInfo) {
  return {
    type: 'DASHBOARD_LOADED',
    user: user,
    systemInfo: systemInfo
  }
}

export function changeTitle(text) {
  return {
    type: 'CHANGE_TITLE',
    text: text,
  }
}

export function changeSubMenu(subMenu) {
  return {
    type: 'CHANGE_SUBMENU',
    subMenu: subMenu
  }
}

export function sideNavToggle(key) {
  return {
    type: 'TOGGLE_SIDENAV_SUBMENU',
    key: key,
  }
}

export function setSideNavSubMenuHeight(key, style) {
  return {
    type: 'SET_SIDENAV_SUBMENU_HEIGHT',
    key: key,
    submenu: style,
  }
}

export function initSideNavToggle(key) {
  return {
    type: 'INIT_SIDENAV_SUBMENU',
    key: key,
  }
}

export function searchToggle() {
  return {
    type: 'TOGGLE_SEARCH',
  }
}

export function apiSuccess(data, route) {
  return {
    type: 'API_SUCCESS',
    data: data,
    route: route,
  }
}

export function apiFailure(error, status, route, path) {
  return {
    type: 'API_FAILURE',
    error: error,
    status: status,
    route: route,
    path: path
  }
}

export const apiRequest = (route, data) => {
  return (dispatch) => {
    let timezone = moment.tz.guess()
    if (!timezone) {
      timezone = 'UTC'
    }

    let isFile = false

    let apiMethod = 'post'
    let config = {
      method: apiMethod,
      headers: {
        'Cee-Tools-Request': 'true',
        'Cee-Tools-Timezone': timezone,
      },
      responseType: 'json',
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
      paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }

    if (route.indexOf('upload') == -1) {
      config.baseURL = '/api/'
    } else {
      // config.baseUrl = '/'
      isFile = true
      // config.headers['Content-Type'] = 'multipart/form-data'
    }

    const checkLogin = function(config) {
      let cookies = new Cookies()
      let login = cookies.get('login')

      if (login === undefined) {
        let host = window.location.host
        // let current = window.location.href;
        let protocol = window.location.protocol
        // let origin = window.location.origin;
        let basePath = protocol + '//' + host

        let path = basePath + window.location.pathname
        let newLocation = basePath + '/callback/?q=' + encodeURIComponent(path)

        window.location.href = newLocation
      }
      return config
    }

    let instance = axios.create(config)
    instance.interceptors.request.use(checkLogin)

    dispatch({type: 'API_REQUESTED', route: route})

    if (isFile) {
      route = '/upload'
      let form = new FormData()

      for (var i in data['files']) {
        let file = data['files'][i]
        form.append('files', file, file.name)
      }

      form.append('data', JSON.stringify(data['data']))

      data = form
    } else {
      data = Object.assign({}, data)
    }

    route = route.replace(/\./g, '/')

    if (apiMethod === 'get') {
      return instance.get(route, {params: data})
    } else {
      return instance.post(route, data)
    }

  }
}

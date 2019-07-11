import store from './store'
import Api from './Api'
import matchPath from './matchPath'
import History from '~/components/Core/History'

Object.defineProperty(String.prototype, 'replaceAll', {
  writeable: false,
  enumerable: false,
  configurable: true,
  value: function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
  },
})

Object.defineProperty(String.prototype, 'toTitleCase', {
  writeable: false,
  enumerable: false,
  configurable: true,
  value: function() {
    var str = this
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }
})

class Utils {
  constructor(reducer=null) {
    this.store = store
    this.api = new Api(store)
    this.reducer = reducer
    this.data = {}
    return this
  }

  async dispatch(action, data=null, reducer=null) {
    var newAction = {}

    if (reducer == null && this.reducer != null) {
      newAction.type = this.reducer.replaceAll('.', '_').toUpperCase() + '_' + action.toUpperCase()
    } else if (reducer != null) {
      newAction.type = reducer.replaceAll('.', '_').toUpperCase() + '_' + action.toUpperCase()
    } else {
      newAction.type = action.toUpperCase()
    }

    if (data != null) {
      for (let key in data) {
        newAction[key] = data[key]
      }
    }

    return await this.store.dispatch(newAction)
  }

  async request(routes, swalOptions=null) {
    this.routes = routes

    // this approach only handles a single api to added a pre hook
    // would be nice to be able to account for multiple apis
    // current idea is to move this functionality into the fetchData method in Api.js
    let pre = async () => {
      if (routes.pre) {
        return await routes.pre()
      }

      return await null
    }

    let args = {
      routes: routes,
      data: {},
      options:{
        pre: pre,
        multi: true,
        swal: swalOptions
      },
    }

    if (routes.path != undefined) {
      args = {
        routes: routes.path,
        data: routes.data,
        options: {
          pre: pre,
          swal: swalOptions
        },
      }
    }

    this.promises = this.api.call({...args})

    return await this.promises
  }

  async getData() {
    return this.promises
  }

  getState(args) {
    var reducer = null

    if (typeof args == 'string') {
      reducer = args
    } else if (typeof args == 'boolean') {
      reducer = this.reducer
    } else {
      reducer = this.reducer
    }

    if (reducer == null) {
      return store.getState()
    } else {
      reducer = reducer.split('.')

      if (reducer.length == 1) {
        return this.store.getState()[reducer[0]]
      }

      var prev = {}
      for (var i = 0; i < reducer.length; i++) {
        if (i == 0) {
          prev = this.store.getState()[reducer[i]]
        }
        else if (i == reducer.length -1) {
          return prev[reducer[i]]
        }
        else {
          prev = prev[reducer[i]]
        }
      }

    }
  }

  updateReducer(newReducer) {
    this.store.injectReducer(newReducer.name, newReducer.data)
  }

  getUser() {
    return this.api.getUser()
  }

  getUserTimezone() {
    let user = this.getUser()

    if (user == undefined) {
      return 'UTC'
    }

    let timezone = user.settings.system.Timezone[0]

    if (!timezone) {
      return 'UTC'
    }

    return timezone.split(' ')[0]
  }

  getSystemInfo() {
    return this.api.getSystemInfo()
  }

  getStore() {
    return this.store
  }

  checkPermissions(app, permission) {
    var user = this.getUser().permissions
    var pKey = 'is_' + permission

    if (user[app] == undefined) {
      return false
    }


    if (user[app][pKey]) {
      return true
    }

    return false
  }

  match(pathname, options = {}) {
    return matchPath(pathname, options)
  }

  go(...args) {
    History.go(...args)
  }

  goBack(...args) {
    History.goBack(...args)
  }

  goForward(...args) {
    History.goForward(...args)
  }

  push(...args) {
    History.push(...args)
  }

  setReducer(reducer) {
    this.reducer = reducer
  }
}

export default Utils

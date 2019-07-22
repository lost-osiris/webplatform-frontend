import Swal from 'sweetalert2'

class SwalHandler {
  constructor(store, options) {
    this.store = store

    if (options == null) {
      this.options = {
        before: {},
        success: {},
        failure: {}
      }
    } else {
      this.options = options
    }
  }

  check(routes) {
    if (routes instanceof Object) { // routes can either be a String or Object
      let found = false
      let action, route

      for (let i in routes) {
        let [isSwal, routeAction] = this.checkRoute(routes[i].path)

        if (isSwal) {
          found = true
          action = routeAction
          route = routes[i]
        }
      }

      if (found) {
        let promise = {
          swal: this.callSwal(action),
          options: this.setOptions(action),
          route: route,
        }

        return [true, promise]
      } else {
        return [false, undefined]
      }

    } else { // when there is more then one api call
      let [isSwal, action] = this.checkRoute(routes)

      if (isSwal) {
        let promise = {
          swal: this.callSwal(action),
          options: this.setOptions(action),
          route: routes,
        }

        return [true, promise]
      } else {
        return [false, undefined]
      }
    }
  }

  checkRoute(path) {
    const systemInfo = this.store.getState().dashboard['systemInfo']

    if (path == 'system.info') {
      return [false, null]
    }

    if (path == 'users.get') {
      return [false, null]
    }

    if (systemInfo != undefined) {
      let route = systemInfo.modules[path]
      if (route != undefined
        && (route.action == 'edit' || route.action == 'remove')) {
        return [true, route.action]
      }

      return [false, null]

    } else {
      return [false, null]
    }
  }

  callSwal(action) {
    let options = this.setOptions(action)
    // return swal(options.before)
    // return options
    return Swal.fire(options.before)
  }

  success(action) {
    let { options } = this.options.success

    if (options == undefined) {
      if (action == 'edit') {
        options = {
          title: 'Edit Success',
          text: 'The edit was Successful'
        }
      } else {
        options = {
          title: 'Remove Success',
          text: 'The remove was Successful'
        }
      }

      if (options.type == undefined) {
        options.type = 'success'
      }

      if (options.timer == undefined) {
        options.timer = 1700
      }
    }

    return options
  }

  failure(action) {
    let { options } = this.options.failure

    if (options == undefined) {
      if (action == 'edit') {
        options = {
          title: 'Edit Failed',
          text: 'The edit failed'
        }
      } else {
        options = {
          title: 'Remove Failed',
          text: 'The removal failed'
        }
      }

      if (options.type == undefined) {
        options.type = 'error'
      }

      if (options.timer == undefined) {
        options.timer = 1700
      }
    }

    return options
  }

  setOptions(action) {
    let { options } = this
    let before = options.before
    let failure = this.failure(action)
    let success = this.success(action)

    if (before.type == undefined) {
      before.type = 'warning'
    }

    if (before.showCancelButton == undefined) {
      before.showCancelButton = true
    }

    if (before.confirmButtonColor == undefined) {
      before.confirmButtonColor = '#DD6B55'
    }

    if (before.confirmButtonText == undefined) {
      before.confirmButtonText = 'Yes'
    }

    if (action == 'remove') {
      before.title = 'Confirm Removal'
      before.text = 'Are you sure you want to remove this?'

    } else {
      before.title = 'Confirm Edit',
      before.text = 'Are you sure you want to edit this?'
    }

    return {before: before, success: success, failure: failure, action: action}
  }

}

export default SwalHandler

import SwalHandler from './SwalHandler'
import { apiRequest, apiSuccess, apiFailure } from '~/actions'

export default class Api {
  constructor(store) {
    this.store = store
  }

  async call({routes, data, options}) {
    let swalOptions = null
    if (options.swal != undefined) {
      swalOptions = options.swal
    }

    let swal = new SwalHandler(this.store, swalOptions)
    let [isSwal, response] = swal.check(routes)

    if (isSwal) {
      try {
        return await response.swal.then((check) => {
          if (check.value) {
            return options.pre().then(() => {
              return this.fetchData(routes, data, options)
            })
          }
        })
      } catch (err) {
        console.warn('User canceled the request.')
      }

    } else {
      return await options.pre().then(() => {
        return this.fetchData(routes, data, options)
      })
    }
  }

  fetchData(routes, data={}, options={multi: false, swal: null}) {
    const dispatchApiCall = (path, data) => {
      let action = this.store.dispatch(apiRequest(path, data))
      return action.then((response) => {
        this.store.dispatch(apiSuccess(response.data, path))
        return response.data
      })
        .catch((error) => this.handleError(path, error.response))
    }

    if (options.multi == undefined) {
      options.multi = false
    }

    if (options.swal == undefined) {
      options.swal = null
    }

    if (options.multi) {
      let promises = new Map()
      let output = {}

      for (let i in routes) {
        let route = routes[i]

        let action = dispatchApiCall(route.path, route.data)
        promises.set(i, action)
      }

      for (let [key, value] of promises) {
        output[key] = value
      }

      return output
    } else {
      return dispatchApiCall(routes, data)
    }
  }

  handleError(path, response) {
    var router = this.store.getState().router
    let args = [
      response.status,
      path,
      router.location.pathname
    ]

    if (response.data != undefined && response.data.message != undefined) {
      args = [response.data.message, ...args]
    } else if (response.status == 403) {
      args = ['access denied', ...args]
    } else {
      args = ['Encountered unknown error', ...args]
    }

    if (args[0] == 'Encountered unknown error') {
      throw args[0]
    }

    this.store.dispatch(apiFailure(...args))
  }

  getUser() {
    return this.store.getState().dashboard.user
  }

  getSystemInfo() {
    return this.store.getState().dashboard.systemInfo
  }
}

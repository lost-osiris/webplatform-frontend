import * as Main from '~/modules/Main/routes'

let routes = [
  () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '~/modules/Admin/routes'),
  () => import(/* webpackChunkName: "Settings", webpackPrefetch: true */ '~/modules/Settings/routes'),
  // INSERT HERE
]

export default routes
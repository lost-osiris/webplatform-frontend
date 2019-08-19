// import * as Main from '~/modules/Main/routes'
import Admin from '~/modules/Admin/routes'

let routes = [
  () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ '~/modules/Admin/routes'),
  // INSERT HERE
]

export default routes
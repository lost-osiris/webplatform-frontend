import * as Main from '~/modules/Main/routes'
import Admin from '~/modules/Admin/routes'
// import SE from 'SupportExceptions/routes'

let routes = [
  // Main.Home,
  () => import('~/modules/Admin/routes'),
  // INSERT HERE
]

export default routes
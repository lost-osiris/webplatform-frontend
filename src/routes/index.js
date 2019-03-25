// Import Static routes
// import Jobs from './modules/JobRunner/containers/RedirectContainer'

import * as Main from '~/modules/Main/routes'
import Admin from '~/modules/Admin/routes'
// import BzCompliance from '~/modules/BzCompliance/routes'
// import Dashboards from '~/modules/Dashboards/routes'
import Findsbr from '~/modules/Findsbr/routes'
// import Info from './Info'
// import Jobs from '.~/modules/JobRunner/routes'
// import Settings from '~/modules/Settings/routes'
import SupportExceptions from '~/modules/SupportExceptions/routes'
// import Products from '~/modules/Products/routes'
// import ReleasePlanning from '~/modules/ReleasePlanning/routes'

let routes = [
  Main.Home,
  // Loader.load(module, '~/modules/SupportExceptions/routes'),
  Admin,
  // BzCompliance,
  // Dashboards,
  Findsbr,
  // Info,
  // Jobs,
  // Settings,
  SupportExceptions,
  // Products,
  // ReleasePlanning,
  // Main.AccessDenied,
  // Main.Logout,
  // Main.NotFound,
]

export default routes

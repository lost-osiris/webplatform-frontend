const Main = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Main')
// import Main from './Main'
const Log = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Log')
// import Log from './Log'

export default {
  Main: Main,
  Log: Log,
}

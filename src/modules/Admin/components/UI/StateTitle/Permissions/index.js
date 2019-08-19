const Main = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Main')
const User = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './User')
const Api = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Api')
const Application = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Application')

export default {
  Main: Main,
  User: User,
  Api: Api,
  Application: Application
}

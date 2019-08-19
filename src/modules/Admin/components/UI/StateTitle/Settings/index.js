const Main = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Main')
const Template = () => import(/* webpackChunkName: "Admin", webpackPrefetch: true */ './Template')

export default {
  Main: Main,
  Template: Template,
}

const Home = () => import(/* webpackChunkName: "Main", webpackPrefetch: true */ '../Views/Home')
export { Home }

export { default as AccessDenied } from '../Views/AccessDenied'
export { default as ServerError } from '../Views/ServerError'

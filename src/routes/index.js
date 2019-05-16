import * as Main from '~/modules/Main/routes'

let routes = [
  Main.Home
]
routes.push(() => import(FUCK))

// console.log(FUCK)
// for (let i = 0; i < APPLICATIONS.length; i++) {
//   // console.log(import(APPLICATIONS.routes[i].path))
//   let promise = () => import(APPLICATIONS[i].path)
//   console.log(promise())
//   // routes.push(() => import(APPLICATIONS[i].path))
// }
//
// var count = 0
// while (count < APPLICATIONS.length) {
//   let promise = () => import(APPLICATIONS[count].path)
//   console.log(promise())
//   count++
// }

export default routes

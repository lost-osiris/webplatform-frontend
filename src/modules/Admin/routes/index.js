import Ahyder from './Children/Ahyder'
import Mowens from './Children/Mowens'

var route = {
  route: {
    path: '/admin',
    children: [
      Ahyder,
      Mowens,
    ]
  },
  ui: {
  }
}

export default route

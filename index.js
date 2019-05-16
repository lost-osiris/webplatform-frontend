let apps = require('cli-paths') // need to figure out how to get the path from the cli into here

module.exports = {
  WebplatformRoutes: [
    ...apps.routes
  ]
}
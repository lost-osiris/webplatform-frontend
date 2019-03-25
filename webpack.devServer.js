const { resolve } = require('path');

const apiPort = ':8080'
const apiHost = 'http://0.0.0.0' + apiPort

const routeOptions = {
  target: apiHost,
  headers: {
    'X-Forwarded-Proto': 'http',
    'X-Nginx-Port': '3000'
  }
}

module.exports = {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 3000,
    contentBase: resolve(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: true,
    proxy: {
      '/api': routeOptions,
      '/callback': routeOptions,
      '/upload': routeOptions,
      '/metadata': routeOptions,
      '/download': routeOptions
    },
    stats: {
      modules: false,
      chunks: false,
      chunckModules: false,
      timings: true,
      warnigns: false
    },
}

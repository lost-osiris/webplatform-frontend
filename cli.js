import arg from 'arg'
import webpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import fs, { appendFileSync } from 'fs'
import shell from 'shelljs'
import { resolve } from 'path'

import webpackConfig from './webpack.config'
import configDevServer from './webpack.config.devServer'

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--port': Number,
            '--name': String,
        },
        {
            argv: rawArgs.slice(2),
        }
    )

    return {
       port: args['--port'] || 3000,
       name: args['--name'],
       application: args._[0] || undefined,
    }
}

function getApps(webpackConfig) {
  let apps = []
  let command = shell.exec('webplatform-cli config get cli', {silent: true})
  let config = JSON.parse(command)

  for (let i in config.applications) {
    let appConfig = config.applications[i].frontend

    let app = {
      name: appConfig.name,
      path: resolve(appConfig.routes)
    }
   
    webpackConfig.entry.main.push(app.path + '/routes')
    webpackConfig.resolve.alias[app.name] = app.path

    apps.push(app)
  }

  return apps
}

export function cli(args) {
    process.env.NODE_ENV = 'development'

    let options = parseArgumentsIntoOptions(args)

    let apps = []
    if (options.application){
      let appPath = resolve(options.application)
      let app = {
        name: options.name,
        path: appPath + '/routes'
      }
      
      webpackConfig.entry.main.push(appPath)
      webpackConfig.resolve.alias[options.name] = appPath

      apps.push(app)
    } 

    apps.push(...getApps(webpackConfig))

    let env = {
      'APPLICATIONS': JSON.stringify(apps),
      'NODE_ENV': 'development'
    }
    let DefinePlugin = new webpack.DefinePlugin(env)
    webpackConfig.plugins.push(DefinePlugin)

    let compiler = webpack(webpackConfig)
    let server = new webpackDevServer(compiler, configDevServer)
    server.listen(options.port, "localhost", function() {})

    // return {
    //   "name": options.name,
    //   "routes": () => import(appPath + "/routes")
    // }
}

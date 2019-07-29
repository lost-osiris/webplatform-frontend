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
  
  let routes = ['// FILE IS AUTOMATICALLY GENERATED', '// DO NOT CHANGE\n']
  let template = fs.readFileSync('./route-template.js', 'utf8').split('\n')
  
  for (let i in template) {
    let line = template[i]
    if (line.indexOf('INSERT HERE') > 0) {
      if (config.applications.length > 0) {
        for (let i in config.applications) {
          let appConfig = config.applications[i].frontend
        
          webpackConfig.entry.main.push(resolve(appConfig.routes, 'routes'))
          webpackConfig.resolve.alias[appConfig.name] = resolve(appConfig.routes)
          
          routes.push(`  () => import('${appConfig.name}/routes'),`)
        }
      }
    } else {
      routes.push(line)
    }
  }


  let stream = fs.writeFileSync('./src/routes/index.js', routes.join('\n'), 'utf8')

  return apps
}

export function cli(args) {
    let options = parseArgumentsIntoOptions(args)

    getApps(webpackConfig).map((value) => value.name + '/routes')

    let env = {
      'NODE_ENV': JSON.stringify('development')
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

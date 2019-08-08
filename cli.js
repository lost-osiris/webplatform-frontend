import arg from 'arg'
import webpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import fs, { appendFileSync } from 'fs'
import shell from 'shelljs'
import { resolve } from 'path'

import webpackDevConfig from './webpack/webpack.dev'
import configDevServer from './webpack/webpack.server'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--port': Number,
      '--name': String,
      '--debug': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  )

  return {
    port: args['--port'] || 3000,
    name: args['--name'],
    default: args['--debug'],
    application: args._[0] || undefined,
  }
}

function getApps(webpackConfig) {
  let apps = []
  let command = shell.exec('webplatform-cli config get variables', {silent: true})
  let config = JSON.parse(command)
  
  let routes = ['// FILE IS AUTOMATICALLY GENERATED', '// DO NOT CHANGE\n']
  let template = fs.readFileSync(resolve(__dirname, './route-template.js'), 'utf8').split('\n')
  
  for (let i in template) {
    let line = template[i]
    if (line.indexOf('INSERT HERE') > 0) {
      if (config['applications-configs'].length > 0) {
        for (let i in config['applications-configs']) {
          let appConfig = config['applications-configs'][i].frontend
        
          if (config['applications-configs'][i].active) {
            webpackConfig.entry.main.push(resolve(appConfig.path, 'routes'))
            webpackConfig.resolve.alias[appConfig.name] = resolve(appConfig.path)
            
            routes.push(`  () => import('${appConfig.name}/routes'),`)
          }
        }
      }
    } else {
      routes.push(line)
    }
  }

  let stream = fs.writeFileSync(resolve(__dirname, './src/routes/index.js'), routes.join('\n'), 'utf8')


  return apps
}

export function cli(args) {
  let options = parseArgumentsIntoOptions(args)

  getApps(webpackDevConfig).map((value) => value.name + '/routes')
  
  let env = {
    'NODE_ENV': JSON.stringify('development')
  }

  let DefinePlugin = new webpack.DefinePlugin(env)
  webpackDevConfig.plugins.push(DefinePlugin)

  if (options.debug) {
    console.log(webpackConfig)
  }

  let compiler = webpack(webpackDevConfig)
  let server = new webpackDevServer(compiler, configDevServer)

  server.listen(options.port, "localhost", function() {})
}

import arg from 'arg'
import webpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import fs from 'fs'
import { resolve } from 'path'

import config from './webpack.config'
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
       application: args._[0],
    }
}

export function cli(args) {
    process.env.NODE_ENV = 'development'

    let options = parseArgumentsIntoOptions(args)
    let appPath = resolve(options.application)

    config.entry.main.push(appPath + '/routes')
    config.resolve.alias[options.name] = appPath

    let apps = [
      {
        name: options.name,
        path: appPath + '/routes'
      }
    ]
    let env = {
      'APPLICATIONS': JSON.stringify(apps),
      'FUCK': JSON.stringify(appPath + '/routes')
    }
    let DefinePlugin = new webpack.DefinePlugin(env)
    config.plugins.push(DefinePlugin)

    let compiler = webpack(config)
    let server = new webpackDevServer(compiler, configDevServer)
    server.listen(options.port, "localhost", function() {})

    // return {
    //   "name": options.name,
    //   "routes": () => import(appPath + "/routes")
    // }
}

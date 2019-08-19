import shell from 'shelljs'
import fs from 'fs'
import { resolve } from 'path'

import webpackDevConfig from '../webpack/webpack.dev'
import webpackProdConfig from '../webpack/webpack.prod'

import parseArgs from './parse-args'

export function cli(args) {
  let options = parseArgs(args)
  let webpackConfig = options.production ? webpackProdConfig : webpackDevConfig
  
  let apps = []
  let command = shell.exec('webplatform-cli config get variables', {silent: true})
  let config = JSON.parse(command)
  
  let routes = ['// FILE IS AUTOMATICALLY GENERATED', '// DO NOT CHANGE\n']
  let template = fs.readFileSync(resolve(__dirname, '../route-template.js'), 'utf8').split('\n')
  
  for (let i in template) {
    let line = template[i]
    if (line.indexOf('INSERT HERE') > 0) {
      if (config['applications-configs'].length > 0) {
        for (let i in config['applications-configs']) {
          let appConfig = config['applications-configs'][i].frontend
        
          if (config['applications-configs'][i].active) {
            routes.push(`  () => import(/* webpackChunkName: "${appConfig.name}", webpackPrefetch: true */ '${appConfig.name}/routes'),`)
          }
        }
      }
    } else {
      routes.push(line)
    }
  }

  fs.writeFileSync(resolve(__dirname, '../src/routes/index.js'), routes.join('\n'), 'utf8')
}
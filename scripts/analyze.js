import parseArgs from './parse-args'
import shell from 'shelljs'

export function cli(args) {
  let options = parseArgs(args)

  if (options.analyze) {
    shell.exec('webpack-bundle-analyzer dist/stats.json')
  }
}
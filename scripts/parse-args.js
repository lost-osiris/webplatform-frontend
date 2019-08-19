import arg from 'arg'

export default (rawArgs) => {
  const args = arg(
    {
      '--port': Number,
      '--name': String,
      '--debug': Boolean,
      '--production': Boolean,
      '--build': Boolean,
      '--analyze': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  )

  return {
    port: args['--port'] || 3000,
    name: args['--name'],
    debug: args['--debug'],
    production: args['--production'],
    build: args['--build'],
    analyze: args['--analyze'],
    application: args._[0] || undefined,
  }
}
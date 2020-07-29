#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const minimist = require('minimist')
const _ = require('lodash')
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  boolean: [ ]
})
const { getServeOptions, getBuildOptions } = require('../lib/utils/shared')
const generateNodeAuthInfo = require('../lib/utils/generateNodeAuthInfo')
const { PORT } = require('../lib/constant')
const pkg = require('../package.json')

program
  .version(`${pkg.name} ${pkg.version}`)
  .usage('<command> [options]')

program
  .command('serve')
  .description('start local service for development and debugging')
  .option('-d --domain <domain>', 'domain name of freelog node')
  .action(async (cmd) => {
    if (cmd['domain']) {
      await generateNodeAuthInfo(cmd['domain'])
    }
    require('../lib/command/serve')()
  })

program
  .command('build')
  .description('Build a freelog app')
  .action(cmd => {
    let opts = getBuildOptions(args)
    require('../lib/command/build')(opts)
  })

program
  .command('authInfo <nodeDomain>')
  .description('create node authorization information based on node domain')
  .option('--cover', 'overwrite the original node authorization information')
  .action(async (nodeDomain) => {
    await generateNodeAuthInfo(nodeDomain)
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`freelog-cli-service <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)
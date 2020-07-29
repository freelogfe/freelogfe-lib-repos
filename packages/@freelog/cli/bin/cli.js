#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const minimist = require('minimist')
const camelize = require('camelize')
const args = require('minimist')(process.argv.slice(2), {
  boolean: []
})
const pkg = require('../package.json')

program
  .version(`${pkg.name} ${pkg.version}`)
  .usage('<command> [options]')

program
  .command('create <project-name>')
  .description('create a new freelog widget project')
  .action((projectName) => {
    require('../lib/create')(projectName)
  })

program
  .command('info')
  .description('print debugging information about your environment')
  .action((cmd) => {
    console.log(chalk.bold('\nEnvironment Info:'))
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

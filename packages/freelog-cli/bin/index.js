const program = require('commander')
const chalk = require('chalk')
const didYouMean = require('didyoumean')

const path = require('path')

const pkg = require('../package.json')

program.version(pkg.version).usage('<command> [options]')
program
  .command('create <widgetName>')
  .description('create a new freelog widget project')
  .option('-d --destPath [value]', 'destination path for generating')
  .action((name, cmd) => {
    require('../src/create')(name, cmd)
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`), '\n')
    suggestCommands(cmd)
  })

program.on('--help', () => {
  console.log(`  Usages:
    ${chalk.gray('# create a new freelog widget project')}
    $ freelog-cli init
    ${chalk.gray('# publish widget to freelog server')}
    $ freelog-cli publish
  `)
})

program.parse(process.argv)


process.on('unhandledRejection', function (err) {
  console.log(err);
  exit(1)
})

// Setting edit distance to 60% of the input string's length
didYouMean.threshold = 0.6
function suggestCommands (cmd) {
  const availableCommands = program.commands.map(cmd => cmd._name)
  const suggestion = didYouMean(cmd, availableCommands)
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}
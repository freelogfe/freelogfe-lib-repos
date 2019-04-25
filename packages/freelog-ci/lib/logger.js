const weblog = require('webpack-log');
const log = weblog({name: 'freelog-ci'}) // webpack-dev-server
const chalk = require('chalk')
const debug = require('debug')('@freelog/freelog-ci')

const Logger = {
  success(msg) {
    log.info(chalk.green(msg))
  },
  info(msg) {
    log.info(msg);
  },
  debug(msg) {
    debug('%%', msg)
  },
  warn(msg) {
    log.warn(chalk.yellow(msg))
  },
  error(msg) {
    log.error(chalk.red(msg))
  }
}

module.exports = Logger
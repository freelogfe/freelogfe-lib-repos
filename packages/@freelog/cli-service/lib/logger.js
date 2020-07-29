var logger = require('fancy-log');
const chalk = require('chalk')
const prefix = 'freelog-server'

function wrapPrefix(msg) {
  return `[${prefix}] ${msg}`
}

exports.log = function (msg) {
  logger.info(wrapPrefix(msg))
}

exports.error = exports.fatal = function (msg) {
  logger.error(wrapPrefix(chalk.red(msg)))
  process.exit(1)
}


exports.success = function (msg) {
  logger.info(wrapPrefix(msg))
}
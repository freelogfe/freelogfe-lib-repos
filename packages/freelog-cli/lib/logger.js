const chalk = require('chalk')
const {createLogger, format, transports} = require('winston')
const {combine, label, printf} = format;
const prefix = 'freelog-cli'

const freelogFormat = printf(info => {
  var colors = {
    info: 'white',
    warn: 'yellowBright',
    error: 'redBright'
  }
  var {label, level, message} = info
  return `[${chalk.gray(label)}] ${chalk[colors[level]](level)}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({label: prefix}),
    freelogFormat
  ),
  transports: [
    new transports.Console()
  ]
});

exports.log = function (msg) {
  logger.info(msg)
}

exports.error = exports.fatal = function (msg) {
  logger.error(chalk.red(JSON.stringify(msg)))
}


exports.success = function (msg) {
  logger.info(msg)
}
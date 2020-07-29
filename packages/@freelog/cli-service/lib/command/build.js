
module.exports = async (options) => {
  const ora = require('ora')
  const rm = require('rimraf')
  const path = require('path')
  const chalk = require('chalk')
  const webpack = require('webpack')
  const fse = require('fs-extra')
  const webpackConfigPath = path.resolve(process.cwd(), 'config/webpack.config.prod.js')

  if (!fse.pathExistsSync(webpackConfigPath)) {
    console.log(chalk.red('[Error]:'), webpackConfigPath, 'does not exist！')
    return 
  }
  const spinner = ora('building for production...')
  const webpackConfig = require(webpackConfigPath)

  spinner.start()
  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) { 
      throw err
      return 
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    spinner.stop()
  })
}
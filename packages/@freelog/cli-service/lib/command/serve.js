
async function serve(options) {
	const fse = require('fs-extra')
	const path = require('path')
	const chalk = require('chalk')
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const { getAvailablePort } = require('../utils/shared')
  const getDevServerConfig = require('../getDevServerConfig')

  const CWD = process.cwd()
  const webpackConfig = require(path.resolve(CWD, 'config/webpack.config.js'))

  const devServerConfig = getDevServerConfig(webpackConfig.devServer, options)
  devServerConfig.port = await getAvailablePort(devServerConfig.port)
  
  const compiler = webpack(webpackConfig)
  var devServer = new WebpackDevServer(compiler, devServerConfig)
  
  const { port, host } = devServerConfig
  devServer.listen(port, host, err => {
    if (err) {
      console.log(err)
      process.exit(1)
      return 
    }

		console.log(`\n${chalk.cyan(`[INFO]`)} Listening at: http://${host}:${port}/ or http://localhost:${port}/`)
		require('../utils/generateDevFiles')(devServerConfig)
  })

  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, function() {
      devServer.close()
      process.exit(1)
    })
  }
}
module.exports = serve
module.exports = function resolveWebpackConfig(options, baseWebpackConf, isDev = true) {
  const webpackMerge = require('webpack-merge')
  const config = webpackMerge(baseWebpackConf, options.webpackConfig)

  if (isDev && options.devServer.hot) {
    const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    const entry = config.entry
    switch(Object.prototype.toString.call(entry)) {
      case '[object String]': {
        config.entry = {
          'client': [ entry, hotMiddlewareScript ]
        }
        break
      }
      case '[object Object]': {
        for (const name in entry) {
          config.entry[name] = [ entry[name], hotMiddlewareScript ]
        }
        break
      }
      case '[object Array]': {
        config.entry = {}
        for (const path of entry) {
          config.entry[path] = [ path, hotMiddlewareScript ]
        }
        break
      }
      default: {}
    }
  }
  return config
}
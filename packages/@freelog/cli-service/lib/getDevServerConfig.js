module.exports = function getDevServerConfig(serverConfig = {}) {
  const path = require('path')
  const fse = require('fs-extra')
  const _ = require('lodash')
  const cors = require('cors')
  const renderIndexMiddleware = require('./middleware/render-index')()
  const { createProxyMiddleware } = require('http-proxy-middleware')  

  const PROXY_QI_TARGET = 'http://qi.testfreelog.com'
  const getBeforeHook = function(serverConfig) {
    const _beforeHook = (app) => {
      app.use(cors({ origin: true, credentials: true }))
      app.use('/v1', createProxyMiddleware({
          target: PROXY_QI_TARGET,
          secure: false, 
          changeOrigin: true,
        }
      ))
      app.use(renderIndexMiddleware)
    }
    if (typeof serverConfig.before === 'function') {
      return (...args) => {
        _beforeHook(...args)
        serverConfig.before(...args)
      }
    } else {
      return _beforeHook
    }
  }
  serverConfig.before = getBeforeHook(serverConfig)

  return _.merge({
    compress: true,
    open: true,
    hot: false,
    quiet: false,
    liveReload: false,
    clientLogLevel: 'none',
    port: 9180,
    host: '127.0.0.1',
  }, serverConfig) 
}
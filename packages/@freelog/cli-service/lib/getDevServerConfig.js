module.exports = function getDevServerConfig(serverConfig = {}, options) {
  const path = require('path')
  const fse = require('fs-extra')
  const _ = require('lodash')
  const cors = require('cors')
  const cookieParser = require('cookie-parser')
  const createRenderIndexMiddleware = require('./middleware/render-index')
  const { createProxyMiddleware } = require('http-proxy-middleware')  

  let openUri = true
  let mainDomain = 'freelog.com'
  let PROXY_QI_TARGET = `https://qi.${mainDomain}`
  const devMode = options['devMode']
  if (devMode && devMode.internal) {
    openUri = false
    mainDomain = 'testfreelog.com'
    PROXY_QI_TARGET = `http://qi.${mainDomain}`
  }
  
  const getBeforeHook = function(serverConfig) {
    const _beforeHook = (app) => {
      app.use(cors({ origin: true, credentials: true }))
      app.use(cookieParser())
      app.use('/v1/', createProxyMiddleware({
          target: PROXY_QI_TARGET,
          // true/false, if you want to verify the SSL Certs
          secure: false, 
          // changes the origin of the host header to the target URL
          changeOrigin: true,
          // rewrites domain of set-cookie headers
          cookieDomainRewrite: {
            [mainDomain]: ''
          }
        }
      ))
      app.use(createRenderIndexMiddleware(options))
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
    open: openUri,
    hot: false,
    quiet: false,
    liveReload: false,
    clientLogLevel: 'none',
    port: 9180,
    disableHostCheck: true,
    host: '127.0.0.1',
  }, serverConfig) 
}
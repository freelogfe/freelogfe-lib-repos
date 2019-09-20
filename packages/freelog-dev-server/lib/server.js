var fs = require('fs')
const lodash = require('lodash')
var path = require('path')
var hostile = require('hostile')
var logger = require('./logger')
var CWD = process.cwd()
var https = require('https')
var http = require('http')
const getPort = require('get-port')
const webpack = require('webpack')
const pkg = require(path.join(CWD, 'package.json'))
var config = require(path.join(CWD, 'config'))
var privateKey = fs.readFileSync(path.join(__dirname, 'cert/server_ca.key'), 'utf8')
var certificate = fs.readFileSync(path.join(__dirname, 'cert/server_ca.crt'), 'utf8')
var credentials = {key: privateKey, cert: certificate}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const isProd = process.env.NODE_ENV === 'production'

var opn = require('opn')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
var cors = require('cors')
var port = config.dev.port
var proxyTable = config.dev.proxyTable
var fs = require('fs')
var app = express()
var webpackConfig = require(path.join(CWD, 'build/webpack.dev.conf'))

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
//
// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: false,
//   heartbeat: 2000
// })

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  console.log('-----', options.filter || context, options)
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(function (req, res, next) {
  if (req.url === '/') {
    var hostDomain = (/\.testfreelog\.com$/.test(req.hostname)) ? 'testfreelog.com' : 'freelog.com'
    var fp = path.join(__dirname, '../static/index.html')
    var pagebuildPath = config.dev.pagebuild || path.join(CWD, 'src', 'pagebuild.html')
    var tpl = lodash.template(fs.readFileSync(fp).toString())
    var pagebuildContent = fs.readFileSync(pagebuildPath).toString()
    var widgetPath = config.dev.widget || `/${pkg.name}.js`
    var importWidget = `<script type="module" src="${widgetPath}"></script>`
    var html = tpl({pagebuildContent, importWidget, hostDomain})
    res.send(html)
  } else {
    next()
  }
})

app.use(require('connect-history-api-fallback')())

app.use(cors(config.cors || {}))

app.use(devMiddleware)

// app.use(hotMiddleware)

app.use(express.static(path.join(CWD, 'dist')))

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')

var httpsServer = https.createServer(credentials, app);

async function getAvailablePort(port) {
  var ports = [port]
  for (let i = 1; i < 11; i++) {
    ports.push(port + i)
  }
  var availablePort = await getPort({port: ports})

  return availablePort
}

(async () => {
  port.https = await getAvailablePort(port.https)
  port.http = await getAvailablePort(port.http)

  var server = httpsServer.listen(port.https)
  var httpServer = http.createServer(app).listen(port.http, function (err) {
  });
})();


function waitUtil() {
  return new Promise(resolve => {
    devMiddleware.waitUntilValid(() => {
      resolve(port)
    })
  })
}

function setHosts() {
  return new Promise((resolve, reject) => {
    hostile.set('127.0.0.1', 'local.testfreelog.com local.freelog.com', function (err) {
      if (err) {
        if (err.code === 'EACCES') {
          logger.error('permisson denied. try again $ sudo npm run dev')
          server.close()
          reject('permisson denied. try again $ sudo npm run dev')
          process.exit(0)
        }
      } else {
        _resolve()
      }
    })
  })
}

Promise.all([waitUtil(), setHosts()]).then(([port]) => {
  _resolve(port)
})

process.on('exit', function () {
  server && server.close()
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
    httpServer.close()
  }
}

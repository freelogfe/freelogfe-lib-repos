const path = require('path')
const fse = require('fs-extra')
const _ = require('lodash')
const getPort = require('get-port')	
const detectPort = require('detect-port')
const axios = require('axios')
const CWD = process.cwd()
const pkg = require(path.join(CWD, 'package.json'))

exports.getAppName = function() {
  return pkg.name
}

async function getAvailablePort(port) {
  var ports = [port]
  for (let i = 1; i < 50; i++) {
    ports.push(port + i)
  }
  var availablePort = await getPort({ port: ports, host: '127.0.0.1' })
  
  return availablePort
} 
exports.getAvailablePort = getAvailablePort 

exports.getServeOptions = async function(args) {
  const { CONFIG_DEVSERVER_PATH, CONFIG_NODEAUTH_PATH, CONFIG_WEBPACK_PATH } = require('../constant')
  let options = require('../defaultOptions')
  const nodeAuthConfigPath = path.join(CWD, CONFIG_NODEAUTH_PATH)
  const webpackConfigPath = path.join(CWD, CONFIG_WEBPACK_PATH)
  if (fse.pathExistsSync(nodeAuthConfigPath)) {
    options = _.merge(options, { nodeAuthInfo: fse.readJSONSync(nodeAuthConfigPath) })
  }
  if (fse.pathExistsSync(webpackConfigPath)) {
    options = _.merge(options, { webpackConfig: require(webpackConfigPath) })
  }
  return options
}

exports.getBuildOptions = function(args) {
  const { CONFIG_WENPACK_PROD_PATH } = require('../constant')
  const webpackConfigPath = path.join(CWD, CONFIG_WENPACK_PROD_PATH)
  const options =  { webpackConfig: {} }
  if (fse.pathExistsSync(webpackConfigPath)) {
    options.webpackConfig = require(webpackConfigPath)
  } 
  return options
}

exports.getLocalNodeAuthInfo = function() {
  const {  CONFIG_NODEAUTH_PATH } = require('../constant')
  const nodeAuthConfigPath = path.join(CWD, CONFIG_NODEAUTH_PATH)
  const _default = { 
    __auth_node_id__: 0, 
    __auth_node_name__: '', 
    __page_build_id: '', 
    __page_build_entity_id: '', 
    __page_build_sub_releases: [] 
  } 
  if (fse.pathExistsSync(nodeAuthConfigPath)) {
    return _.merge(_default, fse.readJSONSync(nodeAuthConfigPath))
  }
  return _default
}

exports.fetchNodeAuthInfo = function(nodeDomain) {
  if (nodeDomain === '') return Promise.resolve(null)
  const origin = /\.testfreelog\.com/.test(nodeDomain) ? 'http://qi.testfreelog.com' : 'https://qi.freelog.com'
  return axios(`${origin}/v1/nodes/authInfo?domainName=${nodeDomain}`) 
    .then(response => response.data)
    .then(res => {
      if (res.errcode !== 0) {
        console.error(res.msg)
        return null
      } 
      return res.data
    })
}

// 从cookie中获取用户授权信息
exports.getUserInfoByCookie = function(cookies) {
	var userInfo = null
  const jwtStr = cookies['authInfo']

	if(jwtStr != null) {
		userInfo = parseJWT(jwtStr)
	}
	return userInfo
}

// 解析JWT获取用户信息对象
function parseJWT(jwtStr) {
	var userInfo = null
	try {
		const arr = jwtStr.split('.')
    // userInfo = atob(arr[1]) 
    userInfo = Buffer.from(arr[1],'base64').toString('utf-8')
		userInfo = JSON.parse(userInfo)

		Object.keys(userInfo).forEach(key=>{
			if (['userName', 'nickname'].includes(key)) {
				userInfo[key] = decodeURIComponent(userInfo[key])
			}
		})
	}catch(e) {
		console.log(e)
		userInfo = null
	}finally {
		return userInfo
	}
}
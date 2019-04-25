const path = require('path')
const userHome = require('user-home')
const assert = require('assert')
const {existsSync} = require('fs')
const {execSync} = require('child_process')

const CWD = process.cwd()

function getConfigFile() {
  const filename = 'ci.conf'
  const files = [path.join(CWD, filename), path.join(userHome, '.freelog', filename)].reduce((files, dir) => {
    return files.concat(['.js', '.json'].map(ext => `${dir}${ext}`))
  }, [])

  for (let i = 0; i < files.length; i++) {
    if (existsSync(files[i])) {
      return files[i]
    }
  }

  return null
}

function getConfig() {
  const accessFile = getConfigFile()
  assert(accessFile, 'not found oss access config file')
  const config = require(accessFile)
  return config
}

const config = getConfig()

/**
 * 获取oss完整配置
 * @param cfg
 * @param cfg.bucket {string}
 * @param cfg.region {string}
 * @returns opts
 */
function getOssConfig(cfg) {
  var opts = Object.assign({}, cfg.oss)
  assert(cfg.bucket, '必须指定oss bucket')
  opts.bucket = cfg.bucket
  opts.region = cfg.region

  return opts
}

function getClearConfig(opts) {
  const deploys = config.deploys || []
  for (let i = 0; i < deploys.length; i++) {
    let item = deploys[i]
    if (item.env === opts.env) {
      let result = Object.assign({}, item)
      result.oss = Object.assign({}, config.oss)
      if (opts.env) {
        result.env = opts.env
      }
      return getOssConfig(Object.assign({
        region: 'oss-cn-shenzhen'//默认是 oss-cn-shenzhen
      }, result))
    }
  }

  return null
}

function getDeployConfig(opts) {
  const brName = getGitBranchName()
  const reg = new RegExp(brName, 'i')
  const deploys = config.deploys || []

  for (let i = 0; i < deploys.length; i++) {
    let item = deploys[i]
    if (reg.test(item.branch)) {
      let result = Object.assign({}, item)

      result.local = opts.dir || item.local || (config.local && path.resolve(config.local)) || ''
      assert(result.local, '没有指定本地推送的目录路径')
      result.local = path.resolve(result.local)

      result.oss = Object.assign({}, config.oss)
      if (opts.env) {
        result.env = opts.env
      }

      return Object.assign({
        path: '',
        cmd: `npm install --production && npm run build:${result.env||''}`,
        region: 'oss-cn-shenzhen'//默认是 oss-cn-shenzhen
      }, result)
    }
  }

  return null
}

function getGitBranchName() {
  var name = execSync(`git branch | grep '*' | sed 's/* //'`, {
    cwd: CWD
  }).toString()
  return name.trim()
}

module.exports = {
  getConfig() {
    return config
  },
  getOssConfig,
  getDeployConfig,
  getClearConfig
}
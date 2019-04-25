const urllib = require('urllib');
const formstream = require('formstream');
const path = require('path')
const inquirer = require('inquirer');
const home = require('user-home')
const fs = require('fs-extra')
const logger = require('../logger')
const freelogConfigPath = path.join(home, '.freelog', 'token')
const CWD = process.cwd()
var pkg = {};

const TestServerDomain = 'testfreelog.com'
const ProdServerDomain = 'freelog.com'
var serverAddr;
var selectedLoginedUser;

function getPublishFile(opts, pkg) {
  if (!opts.file) {
    opts.file = path.join(CWD, 'dist', `${pkg.name}.html`)
  }

  return opts.file
}

function userLogin(params) {
  return new Promise((resolve) => {
    params.jwtType = 'header'
    urllib.request(`${serverAddr}/v1/passport/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data: params
    }, function (err, data, res) {
      resolve(res.headers.authorization);
    })
  });
}


async function loginHandler(answers) {
  const authorization = await userLogin(answers)

  if (!authorization) {
    return logger.error('登录失败')
  } else {
    const ans = await inquirer.prompt([{
      type: 'confirm',
      name: 'shouldSaveToken',
      message: '是否保存登录token'
    }])
    var result = {
      authorization: authorization,
      loginName: answers.loginName
    }
    if (ans.shouldSaveToken) {
      saveLoginToken(result)
    }
    return result
  }
}

/**
 * 后续考虑一次登录后，保存jwt，jwt有效期内一段时间不用再登录
 * @returns {Promise.<TResult>}
 */
async function getUserAuthorization() {
  if (selectedLoginedUser) {
    return Promise.resolve(selectedLoginedUser)
  }

  var tokens = getLoginToken()
  var loginQuestions = [{
    type: 'input',
    name: 'loginName',
    message: 'username'
  }, {
    type: 'password',
    name: 'password',
    message: 'password'
  }];
  var questions
  var users
  let choices = [];
  let answers
  users = Object.keys(tokens)
  users.forEach((name) => {
    if (tokens[name]) {
      choices.push({name: name, value: name})
    }
  })
  if (choices.length) {
    choices.push({
      name: '<重新登录>',
      value: ''
    })
    questions = [{
      type: 'list',
      name: 'loginedName',
      message: '选择已登录的用户',
      choices: choices
    }];
    answers = await inquirer.prompt(questions)
    if (answers.loginedName) {
      return {authorization: tokens[answers.loginedName], loginName: answers.loginedName}
    }
  }

  answers = await inquirer.prompt(loginQuestions)
  return await loginHandler(answers)
}

function confirm(filepath) {
  // {
  //   type: 'input',
  //     name: 'env',
  //   message: `publish to beta/prod`
  // },
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldPublish',
      message: `确定发布 ${filepath}`
    }]);
}

function getLoginToken() {
  var tokenContent = fs.readFileSync(freelogConfigPath).toString()
  var tokenConfig
  try {
    tokenConfig = JSON.parse(tokenContent)
  } catch (e) {
    tokenConfig = {}
  }

  return tokenConfig
}

function saveLoginToken(data) {
  var tokenContent = fs.readFileSync(freelogConfigPath).toString()
  var tokenConfig
  try {
    tokenConfig = JSON.parse(tokenContent)
  } catch (e) {
    tokenConfig = {}
  }

  if (!data.authorization) {
    delete tokenConfig[data.loginName]
  } else {
    tokenConfig[data.loginName] = data.authorization
  }

  fs.writeFileSync(freelogConfigPath, JSON.stringify(tokenConfig, null, 2))
}

function uploadResourceFile(data, authorization) {
  return new Promise((resolve, reject) => {
    var form = formstream();
    form.file('file', data.filePath);
    form.field('resourceType', data.type);

    var req = urllib.request(`${serverAddr}/v1/resources/uploadResourceFile`, {
      method: 'POST',
      headers: Object.assign({authorization}, form.headers()),
      dataType: 'json',
      stream: form
    }, function (err, data, res) {
      if (err) throw new Error(JSON.stringify(err))
      if (data.ret === 0 && data.errcode === 0) {
        resolve(data.data.sha1)
      } else {
        reject(data)
      }
    });
  })
}

function createResource(data, authorization) {
  return uploadResourceFile(data, authorization).then(sha1 => {
    return new Promise((resolve, reject) => {

      var formData = {
        sha1: sha1,
        meta: data.meta,
        resourceName: data.resourceName
      }
      var req = urllib.request(`${serverAddr}/v1/resources`, {
        method: 'POST',
        headers: {
          authorization,
          'Content-Type': 'application/json'
        },
        dataType: 'json',
        data: formData
      }, function (err, data, res) {
        if (err) throw new Error(JSON.stringify(err))
        if (data.ret === 0 && data.errcode === 0) {
          resolve(data.data)
        } else {
          reject(data)
        }
      });
    })
  })
}

/**
 * 提取参数
 * @param opts
 * @param opts.meta  资源meta数据配置文件路径 or json data
 * @param opts.file 上传资源路径
 * @parm opts.type 资源类型
 * @param opts.desc 资源描述(名称)
 * @returns {*}
 */
function getFields(opts) {
  var freelogConfig = pkg.freelogConfig || {}

  if (opts.meta) {
    opts.meta = typeof opts.meta === 'string' ? require(opts.meta) : opts.meta;
  } else {
    opts.meta = freelogConfig.meta || {}
  }

  opts.filePath = opts.filePath || opts.file || getPublishFile(opts, pkg)
  opts.type = opts.type || freelogConfig.type || ''

  if (opts.type === 'widget') {
    opts.meta.widgetName = opts.meta.widgetName || pkg.name
    opts.meta.version = opts.meta.version || freelogConfig.version || pkg.version
  }

  opts.resourceName = opts.resourceName
    || freelogConfig.name
    || pkg.name
    || path.basename(opts.filePath, path.extname(opts.filePath))
    || opts.desc;

  return opts
}

function askSubmitPolicy(policy) {
  return inquirer.prompt([{
    type: 'confirm',
    name: 'shouldPublishPolicy',
    message: `存在policy文件\n${policy} \n 确定发布?`
  }]);
}

async function submitPolicy(resource, authorization, opts) {
  var policyPath = (pkg && pkg.policyPath) || path.join(CWD, '.policy')

  try {
    const hasPolicy = await checkPolicyFile(policyPath)
    if (hasPolicy) {
      var policy = fs.readFileSync(policyPath).toString()
      if (policy) {
        let shouldPublish

        if (opts.ignoreQuestions) {
          shouldPublish = true
        } else {
          const {shouldPublishPolicy} = await askSubmitPolicy(policy)
          shouldPublish = shouldPublishPolicy
        }
        if (shouldPublish) {
          await createAuthScheme(Object.assign(resource, {
            policy,
            authorization
          }))
        }
      }
    }
  } catch (e) {
    logger.error(e)
  }
}

function checkPolicyFile(policyPath) {
  return Promise.resolve().then(function () {
    return (fs.existsSync(policyPath)) ? policyPath : null
  })
}


function createPolicy(scheme, data) {
  return new Promise((resolve, reject) => {
    var req = urllib.request(`${serverAddr}/v1/resources/authSchemes/${scheme.authSchemeId}`, {
      method: 'PUT',
      headers: {
        authorization: data.authorization,
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data: data.form
    }, function (err, data, res) {
      if (err) throw new Error(JSON.stringify(err))
      if (data.ret === 0 && data.errcode === 0) {
        resolve(true)
      } else {
        reject(data)
      }
    })
  })
}

function createAuthScheme(data) {
  return new Promise((resolve, reject) => {
    var policies = pkg.policies || (data.policy && [{
      policyName: '授权策略',
      policyText: Buffer.from(data.policy).toString('base64')
    }]) || [];

    if (!policies.length) {
      return reject('没有找到资源授权策略')
    }

    var form = {
      authSchemeName: '授权方案',
      resourceId: data.resourceId
    };

    var req = urllib.request(`${serverAddr}/v1/resources/authSchemes`, {
      method: 'POST',
      headers: {
        authorization: data.authorization,
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data: form
    }, function (err, result, res) {
      if (err) throw new Error(JSON.stringify(err))
      if (result.ret === 0 && result.errcode === 0) {
        createPolicy(result.data, {
          form: {
            policies: {addPolicySegments: policies},
            isOnline: 1
          },
          authorization: data.authorization
        }).then((data) => {
          console.log('授权方案创建成功')
          resolve(data)
        }).catch(reject)
      } else {
        reject(result)
      }
    });
  })
}

function publish(opts, data) {
  return createResource(opts, data.authorization)
    .then((resource) => {
      logger.success('资源创建成功')
      if (opts.policyText) {
        return createAuthScheme(Object.assign(resource, {
          policy: opts.policyText,
          authorization: data.authorization
        }))
      } else {
        return submitPolicy(resource, data.authorization, opts)
      }
    })
    .catch((err) => {
      logger.fatal((err.ret && err.msg) || err);
      //登录过期，重新登录发布
      if (err.ret && err.errcode === 28) {
        data.authorization = ''
        saveLoginToken(data)
        publish(opts)
      }
    })
}

function createLoader(loader) {
  var handles = []
  var loading = false
  var value
  return (fn) => {
    if (!loading && value) {
      fn(value)
    } else if (!loading) {
      loading = true
      handles.push(fn)

      loader((val) => {
        let handle
        value = val
        loading = false
        while ((handle = handles.shift())) {
          handle(value)
        }
      })
    } else {
      handles.push(fn)
    }
  }
}

class PublishClient {
  /**
   * publish client
   * @param config
   * @param config.username
   * @param config.password
   */
  constructor(config) {
    this.config = config || {}
    setServerAddr(config.isProd)
    this.login()
  }

  login() {
    const config = this.config
    this.onLogined = createLoader((callback) => {
      userLogin({
        loginName: config.username,
        password: config.password
      }).then((authorization) => {
        if (!authorization) {
          logger.error('登录失败')
        } else {
          this.config.authorization = authorization
          callback(authorization)
        }
      })
    })
  }

  /**
   * 发布资源
   * @param opt {object} publish resource options
   * @param opt.resourceName {string}
   * @param opt.meta {object} resource meta info
   * @param opt.filePath {string} resource file path
   * @param opt.type {string} resource type
   * @param isProd {boolean} mean wheather publish to prod env or test env
   * @returns {Promise<any>}
   */

  async publish(opts, isProd) {
    return new Promise((resolve, reject) => {
      setServerAddr(isProd)
      this.onLogined((authorization) => {
        opts = getFields(opts)
        opts.ignoreQuestions = true
        publish(opts, {authorization}).then(resolve).catch(reject)
      })
    })
  }

  async createScheme(resource) {
    return new Promise((resolve, reject) => {
      this.onLogined((authorization) => {
        var opts = {
          ignoreQuestions: true
        }
        submitPolicy(resource, authorization, opts).then(resolve).catch(reject)
      })
    })
  }
}


function setServerAddr(isProd) {
  if (isProd) {
    serverAddr = `https://api.${ProdServerDomain}`
  } else {
    serverAddr = `http://api.${TestServerDomain}`
  }
}

module.exports.publish = async function (opts, env) {
  const isProd = env === 'prod'
  fs.ensureFileSync(freelogConfigPath)
  opts = opts || {}
  pkg = require(path.join(CWD, 'package.json'));

  setServerAddr(isProd)
  opts = getFields(opts)

  try {
    const {shouldPublish} = await confirm(opts.filePath)
    if (shouldPublish) {
      const data = await getUserAuthorization()
      if (data.authorization) {
        if (!selectedLoginedUser) {
          selectedLoginedUser = data
        }

        await publish(opts, data)
      }
    }
  } catch (err) {
    logger.error(err)
  }
}

module.exports.PublishClient = PublishClient

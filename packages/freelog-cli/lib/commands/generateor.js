const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const home = require('user-home')
const download = require('download-git-repo')
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const fs = require('fs-extra')
const rm = require('rimraf').sync
const ora = require('ora')
const render = require('consolidate').handlebars.render
const path = require('path')
const async = require('async');
const upperCamelCase = require('uppercamelcase');
const logger = require('../logger')
const TPL_DIR = path.join(home, '.freelog-templates')
const tmp = require('tmp')

const defaultRepositoryName = 'freelogfe/freelog-component-template'
const TEMPLATE_NORMAL = 'template-normal'
const TEMPLATE_VUE = 'template-vue'

function getOptions(src) {
  return require(`${src}/meta`)
}

function copyTo(src, dest, done) {
  var metalsmith = Metalsmith(src)
  metalsmith.clean(false)
    .source('.')
    .destination(dest)
    .build((err) => {
      if (err) throw err;
      done()
    })
}

function generate(opts) {
  var metaOpts = getOptions(opts.src)

  if (!opts.isCustomTemplate) {
    if (opts.templateType === TEMPLATE_VUE) {
      delete metaOpts.questions.enableShadowDom
    }
    opts.tmplPath = path.join(opts.src, 'templates', opts.templateType)
    copyTo(path.join(opts.src, 'docs'), opts.tmplPath, () => {
      runMetalsmith(metaOpts, opts)
    })
  } else {
    opts.tmplPath = path.join(opts.src, 'template')
    runMetalsmith(metaOpts, opts)
  }
}

function runMetalsmith(metaOpts, opts) {
  var metalsmith = Metalsmith(opts.tmplPath)
  var metaData = metalsmith.metadata()

  var tmpobj = tmp.dirSync({prefix: 'freelog-'})
  metaData.tmpTo = tmpobj.name

  metalsmith.use(askQuestions(metaOpts.questions))
    .use(resolveMetaData(opts))
    .use(renderTemplateFiles(opts))

  metalsmith.clean(false)
    .source('.')
    .destination(metaData.tmpTo)
    .build((err, files) => {
      if (err) throw err

      copyTo(metaData.tmpTo, metaData.destDirName, () => {
        if (typeof metaOpts.complete === 'function') {
          const helpers = {chalk, logger, files}
          metaOpts.complete(metaData, helpers)
        } else {
          logger.success('init success')
        }
      })
    })

  return metaData
}

function resolveMetaData(opts) {
  return (files, metalsmith, done) => {
    var metaData = metalsmith.metadata()
    const to = opts.destPath ? opts.destPath : path.join(process.cwd(), metaData.name);

    Object.assign(metaData, {
      destDirName: to,
      widgetName: upperCamelCase(metaData.name)
    })

    done()
  }
}

function loadRepository(tpl) {
  return new Promise((resolve, reject) => {
    if (exists(tpl)) {
      resolve(tpl)
    } else {
      const spinner = ora('downloading template')
      spinner.start()
      var src = path.join(TPL_DIR, tpl)
      if (exists(src)) rm(src)
      download(tpl, src, {clone: true}, err => {
        spinner.stop()
        if (err) logger.fatal(`Failed to download repo ${tpl}: ` + err.message.trim())
        resolve(src)
      })
    }
  })
}

//Metalsmith plugin
function askQuestions(questions) {
  return (files, metalsmith, done) => {
    var metadata = metalsmith.metadata()
    async.eachSeries(Object.keys(questions), (key, next) => {
      var question = Object.assign({
        name: key
      }, questions[key])
      if (!question.message && question.label) {
        question.message = question.label
      }
      inquirer.prompt([question])
        .then((answers) => {
          if (Array.isArray(answers[key])) {
            metadata[key] = {}
            answers[key].forEach(multiChoiceAnswer => {
              metadata[key][multiChoiceAnswer] = true
            })
          } else if (typeof answers[key] === 'string') {
            metadata[key] = answers[key].replace(/"/g, '\\"')
          } else {
            metadata[key] = answers[key]
          }
          next()
        })
        .catch((err) => {
          console.log(err)
        })
    }, done)
  }
}

//Metalsmith plugin
function renderTemplateFiles() {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files)
    const metaData = metalsmith.metadata()

    async.each(keys, (key, next) => {
      const str = files[key].contents.toString()
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
      render(str, metaData, (err, res) => {
        if (err) {
          err.message = `[${key}] ${err.message}`
          return next(err)
        }
        files[key].contents = Buffer.from(res)
        next()
      })
    }, done)
  }
}


function getTemplateList(src) {
  return fs.readdirSync(path.join(src, 'templates'))
}

module.exports = async function (opts) {
  opts = opts || {}
  opts.isCustomTemplate = !!opts.templateTarget
  opts.templateTarget = opts.isCustomTemplate ? opts.templateTarget : defaultRepositoryName
  var src = await loadRepository(opts.templateTarget)

  if (!opts.isCustomTemplate) {
    let tpls = getTemplateList(src)
    let answers = await inquirer.prompt([{
      type: 'list',
      name: 'templateType',
      message: 'select one template:',
      'default': tpls[0],
      choices: tpls
    }])
    opts.templateType = answers.templateType
  }

  Object.assign(opts, {src})
  generate(opts)
}

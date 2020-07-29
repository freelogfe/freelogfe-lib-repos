const fse = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const chalk = require('chalk')
const ora = require('ora')
const Metalsmith = require('metalsmith')
const async = require('async')
const execa = require('execa')
const render = require('consolidate').handlebars.render
const inquirer = require('inquirer')

const pkg = require('../package.json')
const CWD = process.cwd()
const FREELOG_WIDGET_TPL_REPO = 'freelogfe/freelog-widget-template'
const templateTemporaryDirPath = path.join(CWD, '.freelog-widget-template')
const getQuestions = require('./questions')


process.on('exit', (code) => {
  cleanTemporaryDir()
})

module.exports = async (projectName, options = {}) => {
  const targetProjectDirPath = path.join(CWD, projectName)
  if (projectDirExists(targetProjectDirPath)) return 
  await loadTemplateRepository()
  const opts = _.merge({}, {})
  const questions = getQuestions({ templateTemporaryDirPath })
  let answers = await inquirer.prompt(questions)
  const { templateType } = answers
  options = _.merge(options, answers, {
    name: projectName,
    targetProjectDirPath,
    targetTemplateDirPath: path.join(templateTemporaryDirPath, 'templates', templateType)
  })
  logCliPkgInfo()
  await generateProject(options) 
  console.log(`🎉  Successfully created project ${projectName}.`)
  await installDependencies(targetProjectDirPath)
  console.log(
    '👉  Get started with the following commands:\n',
    chalk.cyan(` ${chalk.gray('$')} cd ${projectName}\n`),
    chalk.cyan(` ${chalk.gray('$')} npm run dev\n`)
  )
  cleanTemporaryDir()
}

function projectDirExists(dirPath) {
  if (fse.pathExistsSync(dirPath)) {
    logCliPkgInfo()
    console.log(`Target directory ${chalk.green.bold(dirPath)} already exists.`)
    console.log('Either try using a new directory name, or remove the files listed above.')
    return true
  } else {
    return false
  }
}

function logCliPkgInfo() {
  console.log(`\n${chalk.blue.bold(pkg.name + ' v' + pkg.version)}\n`)
}

function loadTemplateRepository() {
  return new Promise(resolve => {
    const spinner = ora('Downloading template...')
    spinner.start()
    const download = require('download-git-repo')
    download(FREELOG_WIDGET_TPL_REPO, templateTemporaryDirPath, { clone: false }, err => {
      spinner.stop()
      if (err) console.error(`Failed to download repo ${chalk.blue.bold(FREELOG_WIDGET_TPL_REPO)}: ` + err.message.trim())
      resolve()
    })
  })
  
}

function generateProject(opts) {
  const { targetTemplateDirPath, targetProjectDirPath } = opts
  return new Promise(resolve => {
    Metalsmith(targetTemplateDirPath)
      .clean(false)
      .source('.')
      .metadata(opts)
      .destination(targetProjectDirPath)
      .use(renderTemplate)
      .build(function(err, files) {
        if (err) { throw err; }
        resolve()
      })
  })
  
}

function renderTemplate(files, metalsmith, done){
  const keys = Object.keys(files)
  var metadata = metalsmith.metadata()
  async.each(keys, run, done)

  function run(file, next){
    const str = files[file].contents.toString()
    if (!/{{([^{}]+)}}/g.test(str)) {
      return next()
    }
    render(str, metadata, function(err, res){
      if (err) {
        err.message = `[${key}] ${err.message}`
        return next(err)
      }
      files[file].contents = Buffer.from(res)
      next()
    })
  }
}

async function installDependencies(projectDirPath) {
  console.log(`📦  Installing dependencies. This might take a while...`)
  await executeCommand('npm', [ 'install' ], projectDirPath)
}

function executeCommand(command, args, cwd = CWD) {
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd,
      stdio: ['inherit', command === 'yarn' ? 'pipe' : 'inherit']
    })

    child.on('close', code => {
      if (code !== 0) {
        reject(`command failed: ${command} ${args.join(' ')}`)
        return
      }
      resolve()
    })
  })
}

function cleanTemporaryDir() {
  fse.removeSync(templateTemporaryDirPath)
}
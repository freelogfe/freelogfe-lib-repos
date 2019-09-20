const fs = require('fs')
const path = require('path')

const home = require('user-home')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const rm = require('rimraf').sync
const ora = require('ora')
const render = require('consolidate').handlebars.render
const async = require('async')

async function create(widgetName, options) {
  
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
      const download = require('download-git-repo')
      download(tpl, src, { clone: true }, err => {
        spinner.stop()
        if (err) logger.fatal(`Failed to download repo ${tpl}: ` + err.message.trim())
        resolve(src)
      })
    }
  })
}

module.exports = async function (name, options) {
  // await loadRepository()
  const widgetName
  await create(widgetName).catch(err => {
    console.log('err --', err)
  })
}


const cwd = process.cwd()




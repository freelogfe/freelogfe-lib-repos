module.exports = async function generateNodeAuthInfo(nodeDomain) {
  const chalk = require('chalk')
  const fse = require('fs-extra')
  const path = require('path')
  const inquirer = require('inquirer')

  const { fetchNodeAuthInfo } = require('./shared')
  const { CONFIG_NODEAUTH_PATH } = require('../constant')
  const nodeInfoPath = path.join(process.cwd(), CONFIG_NODEAUTH_PATH)
  nodeDomain = nodeDomain.replace(/^(https?:\/\/)/i, '').replace(/(\/+)?$/i, '')
  const authInfo = await fetchNodeAuthInfo(nodeDomain)
  if (authInfo != null) {

    if (fse.pathExistsSync(nodeInfoPath)) {
      const answers = await inquirer.prompt([
        { 
          type: 'confirm', 
          name: 'isCover', 
          message: 'node authorization information already exists, whether to overwrite?',
          default: true
        }
      ])
      if (!answers['isCover']) return
      writeAuthInfo(authInfo) 
      console.log(`\n[${chalk.green.bold(nodeDomain)}] node authorization information is successfully overwritten.`, '\n') 
    } else {
      writeAuthInfo(authInfo, true)
      console.log(`\n[${chalk.green.bold(nodeDomain)}] node authorization information created successfully.`, '\n')
    }
  } else {
    console.log(`\nNode domain name (${chalk.red.bold(nodeDomain)}) does not exist or is invalid, unable to obtain node authorization information.`, '\n')
  }

  function writeAuthInfo(authInfo, isNew = false) {
    if (isNew) {
      fse.ensureFileSync(nodeInfoPath)
    }
    if (authInfo.__page_build_sub_releases) {
      authInfo.__page_build_sub_releases = []
    }
    fse.writeFileSync(nodeInfoPath, JSON.stringify(authInfo, null, '\t'))
  }
}
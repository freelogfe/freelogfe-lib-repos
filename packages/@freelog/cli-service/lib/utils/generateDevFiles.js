module.exports = function generateDevFiles(devServerConfig) {
  const path = require('path')
  const fse = require('fs-extra')
  const cwd = process.cwd()
  const { THEME_FIlE_PATH } = require('../constant')
  const themeFilePath = path.join(cwd, THEME_FIlE_PATH)
  if (!fse.pathExistsSync(themeFilePath)) {
    fse.ensureFileSync(themeFilePath)
    fse.writeFileSync(themeFilePath, '<div id="freelog-app"></div>')
  }
}
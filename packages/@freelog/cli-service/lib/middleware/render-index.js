module.exports = (options) => {
  return (req, res, next) => {
    const axios = require('axios')
    const nunjucks = require('nunjucks')
    const cheerio = require('cheerio')
    const path = require('path')
    const fse = require('fs-extra')
    const _ = require('lodash')
    const { getAppName, getLocalNodeAuthInfo, getUserInfoByCookie } = require('../utils/shared') 
    const CWD = process.cwd()
    const { NODE_TITLE, THEME_FIlE_PATH, CONFIG_NODEAUTH_PATH } = require('../constant')
    const devMode = options['devMode']
    const NODE_INDEX_TPL_URL = !devMode.internal ? 'http://frcdn.oss-cn-shenzhen.aliyuncs.com/pagebuild/index.html' : 'http://test-frcdn.oss-cn-shenzhen.aliyuncs.com/pagebuild/index.html' 
    
    if (req.url !== '/' && req.url !== '/index.html') {
      next()
    } else {
      let themeHTMLFragment = ''
      const themePath = path.join(CWD, THEME_FIlE_PATH)
      const nodeAuthConfigPath = path.join(CWD, CONFIG_NODEAUTH_PATH)
      if (fse.pathExistsSync(themePath)) {
        themeHTMLFragment = fse.readFileSync(themePath).toString()
      }
      const userInfo = getUserInfoByCookie(req.cookies)
      const nodeAuthInfo = getLocalNodeAuthInfo() 
      
      axios.get(NODE_INDEX_TPL_URL)
        .then(response => response.data)
        .then(html => {
          html = nunjucks.renderString(html, {
            title: NODE_TITLE,
            keywords: '',
            description: '',
            authInfoFragment: `<script>window.__auth_info__=${JSON.stringify(nodeAuthInfo)}</script>`,
            pbFragment: nodeAuthInfo.__auth_error_info__ == null ? themeHTMLFragment : ''
          })
          const $ = cheerio.load(html)
          $('body').append(`<script src="/${getAppName()}.js" async="async"></script>`)
          res.send($.html())
        })
        .catch(e => console.error(e))
    }
  }
}

module.exports = () => {
  return (req, res, next) => {
    const axios = require('axios')
    const nunjucks = require('nunjucks')
    const cheerio = require('cheerio')
    const path = require('path')
    const fse = require('fs-extra')
    const _ = require('lodash')
    const { getAppName, getLocalNodeAuthInfo } = require('../utils/shared') 
    const CWD = process.cwd()
    const { NODE_INDEX_TPL_URL, NODE_TITLE, THEME_FIlE_PATH, CONFIG_NODEAUTH_PATH } = require('../constant')
    
    if (req.url !== '/') {
      next()
    } else {
      let themeHTMLFragment = ''
      const themePath = path.join(CWD, THEME_FIlE_PATH)
      const nodeAuthConfigPath = path.join(CWD, CONFIG_NODEAUTH_PATH)
      if (fse.pathExistsSync(themePath)) {
        themeHTMLFragment = fse.readFileSync(themePath).toString()
      }
      const nodeAuthInfo = getLocalNodeAuthInfo() 
      
      axios.get(NODE_INDEX_TPL_URL)
        .then(response => response.data)
        .then(html => {
          html = nunjucks.renderString(html, {
            title: NODE_TITLE,
            keywords: '',
            description: '',
            authInfoFragment: `<script>window.__auth_info__=${JSON.stringify(nodeAuthInfo)}</script>`,
            pbFragment: themeHTMLFragment
          })
          const $ = cheerio.load(html)
          $('body').append(`<script src="/${getAppName()}.js" async="async"></script>`)
          res.send($.html())
        })
        .catch(e => console.error(e))
    }
  }
}
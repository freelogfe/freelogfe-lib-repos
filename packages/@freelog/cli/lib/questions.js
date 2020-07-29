
module.exports = function getQuestions({ templateTemporaryDirPath }) {
  const fse = require('fs-extra')
  const path = require('path')
  const chalk = require('chalk')
  
  function getTemplateChoices(tmplDirPath) {
    const templates = fse.readdirSync(path.join(tmplDirPath, 'templates'))
    const dirPkg = fse.readJSONSync(path.join(tmplDirPath, 'package.json'))
    const templatesDesc = dirPkg.__templates_description__
    return templates.map(value => {
      return {
        value,
        name: chalk.bold(value) + `  ${templatesDesc[value]}`,
        short: value
      }
    })
  }
  return [
    {
      type: 'list',
      name: 'templateType',
      message: 'select one template:',
      choices: getTemplateChoices(templateTemporaryDirPath),
    },
    // {
    //   name: 'enableShadowDom',
    //   type: 'confirm',
    //   required: true,
    //   label: 'enable shadow dom'
    // },
    {
      name: 'description',
      type: 'string',
      required: true,
      label: 'widget description',
      default: 'Freelog App'
    },
    {
      name: 'author',
      type: 'string',
      label: 'Author',
    },
    {
      name: 'license',
      type: 'string',
      label: 'License',
      default: 'MIT'
    }
  ]
} 

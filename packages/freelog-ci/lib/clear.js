//清理旧的发布资源文件
const oss = require('ali-oss')
const {getClearConfig} = require('./get-config')
const logger = require('../lib/logger')

async function clear(opts) {
  const ossConfig = getClearConfig(opts)
  assert(ossConfig, '未找到oss配置')
  const ossClient = oss(ossConfig)
  var result = await ossClient.list({
    'max-keys': 1e3
  })
  const outdate = new Date(opts.date || Date.now())
  result.objects.forEach(async (file) => {
    if (new Date(file.lastModified) < outdate) {
      await ossClient.delete(file.name)
      logger.info(`${new Date(file.lastModified).toLocaleString} delete ${file.name}`)
    }
  })
}

module.exports = clear
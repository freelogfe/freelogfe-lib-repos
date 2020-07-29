module.exports = function openUri(devServerConfig) {
  const open = require('open')
  const { port, open: openOpts } = devServerConfig
  const uri = `http://127.0.0.1:${port}/`
  switch(typeof openOpts) {
    case 'boolean': {
      openOpts && open(uri)
      break
    }
    case 'string': {
      open(uri, { app: openOpts })
      break
    }
    case 'object': {
      if (openOpts.app) {
        open(uri, openOpts)
      } else {
        open(uri)
      }
      break
    }
    default: open(uri)
  }
}
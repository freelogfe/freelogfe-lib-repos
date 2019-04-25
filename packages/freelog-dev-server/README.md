# freelog-dev-server

> This development server used for developing freelog component.

## support

- autoOpenBrowser
- autoOpenBrowser URI
- port
- [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware)proxyTable


## usage
make your configuration in config/index.js file, like

```js
module.exports = {
  dev: {
    port: 9001,
    //uri: '', //auto open uri
    autoOpenBrowser: false,
    proxyTable: {
      '/api': {
        changeOrigin: true,
        autoRewrite: true,
        target: 'http://www.freelog.com'
      }
    }
  }
}

```
# @freelog/cli-service

基于freelog平台的widget资源本地开发服务，widget开发者可通过命令行快速启动一个模拟freelog节点渲染的本地代理服务，从而实现widget的本地开发与调试。

## 使用方法

- 启动服务

```sh
// 启动服务，模拟生产环境
freelog-cli-service serve

// freelog内部开发，即模拟测试测环境
freelog-cli-service serve --internal
```

- 创建节点配置

```sh
freelog-cli-service authInfo xxx.freelog.com
```

- widget项目构建

```sh
freelog-cli-service build 
```

## 工作原理

1. 通过freelog-cli-service authInfo获取节点配置；
2. 使用webpack进行项目构建，并通过webpack-dev-server启动本地服务（默认端口：9180）；
3. 每次访问`http://127.0.0.1:9180`，服务将重新拉取节点页面的静态资源html，并结合节点配置与节点主题（即./public/theme.template.html）返回对应节点的C端渲染文档；
4. 每当访问`http://127.0.0.1:9180/v1/*`的url时，本地服务将其转发成`http://qi.freelog.com/v1/*`
5. 通过中间件重写headers的set-cookie，解决跨域问题，从而实现本地用户登录。


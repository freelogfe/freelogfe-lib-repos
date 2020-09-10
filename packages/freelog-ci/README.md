## freelog-ci
阿里云oss的前端部署

### 快速开始

#### install
```sh
$ npm i -g @freelog/freelog-ci
```

#### OSS配置
在根目录``~/.freelog`` 或 当前项目目录下创建 ``oss.conf.js``或``oss.conf.json``配置文件，内容如下

```json
{
  "accessKeyId": "your alioss accessKeyId",
  "accessKeySecret": "your alioss accessKeySecret"
}
```

#### ci.conf.js
于当前项目目录下创建 `ci.conf.js`配置文件

```js
const path = require('path')
const userHome = require('user-home')
const ossConfig = require(path.join(userHome, '.freelog', 'oss-config.json')) // 避免泄漏oss keys

const targetPath = 'pagebuild/'
module.exports = {
  // aliyun oss 配置
  oss: ossConfig,
  // 项目构建目录
  local: './dist',
  // git分支名对应的发布环境
  deploys: [{
    // 项目分支名
    branch: 'publish',
    // 环境参数
    env: 'prod',
    // 部署前执行的构建命令
    cmd: `npm run build:prod`,
    // aliyun bucket名称
    bucket: 'frcdn',
    // 部署至指定bucket的路径
    path: targetPath
  }, {
    branch: 'beta',
    env: 'beta',
    bucket: 'frcdn',
    path: 'beta/'
  }, {
    branch: 'daily',
    env: 'test',
    cmd: `npm run build:test`,
    bucket: 'test-frcdn',
    path: targetPath
  }, {
    branch: 'master',
    env: 'test',
    bucket: 'test-frcdn',
    path: targetPath
  }],
  // 部署完成后的回调
  after() {
  }
}

```

#### 在当前仓库执行进行发布
```sh
$ freelog-ci deploy
```

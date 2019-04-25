module.exports = {
  //aliyun oss 配置，注意安全性，别对外泄露
  oss: {
    "accessKeyId": "your alioss accessKeyId",
    "accessKeySecret": "your alioss accessKeySecret"
  },
  //git分支名对应的发布环境
  local: './dist',
  deploys: [{
    branch: 'publish',
    env: 'prod',
    bucket: 'your oss bucket',
    path: '',
    cmd: '',
    // region: ''//默认是 oss-cn-shenzhen
    //  bucket: '' //根据下方配置
  }, {
    branch: 'daily',
    env: 'beta',
    bucket: 'your oss bucket',
    path: '',
    cmd: '',
    // region: ''//默认是 oss-cn-shenzhen
    //  bucket: '' //根据下方配置
  }]
}
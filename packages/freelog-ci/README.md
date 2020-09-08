# freelog-ci
> 阿里云oss的前端部署

## quick start
- install
```sh
$ npm i -g @freelog/freelog-ci
```

- 在根目录``~/.freelog`` 或 当前项目目录下创建 ``oss.conf.js``或``oss.conf.json``配置文件，内容如下

```json
{
  "accessKeyId": "your alioss accessKeyId",
  "accessKeySecret": "your alioss accessKeySecret"
}
```

- 在当前仓库执行进行发布
```sh
$ freelog-ci deploy
```

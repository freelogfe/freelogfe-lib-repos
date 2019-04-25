# freelog-cli

> freelog命令行工具



[![NPM version](https://img.shields.io/npm/v/@freelog/freelog-cli.svg?style=flat)](https://www.npmjs.com/package/@freelog/freelog-cli)


## install

[![@freelog/freelog-cli](https://nodei.co/npm/@freelog/freelog-cli.png)](https://npmjs.org/package/@freelog/freelog-cli)


```sh
$ npm i @freelog/freelog-cli -g
```

## command


### init
初始化freelog组件的脚手架
```sh
$ freelog-cli init
```

命令参数
- -t: init with local template
- -d: destination path for generating scaffold


#### templates
- [webpack template](https://github.com/freelogfe/freelog-component-webpack-template)
- [simple template](https://github.com/freelogfe/freelog-component-template)

### publish
发布freelog组件
```sh
$ freelog-cli pubilsh
```

需输入username和password，登录后的token可保存一段时间。如果publish的当前目录下存在.policy文件，即资源策略文件，可决定是否提交。

命令参数
- -t: resource type
- -d: resource description
- -f: path of the resource file to publish
- -m: the path of meta config 

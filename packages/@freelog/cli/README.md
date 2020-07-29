# Freelog Cli

@freelog/freelog-cli，是一款Freelog平台官方提供脚手架，用于创建无构建配置的Freelog widget开发项目。

## 环境准备
- 操作系统： all
- 运行环境: 建议选择 node [LTS 版本](https://nodejs.org/en/)，最低要求 8.x

## 快速初始化
```sh
npx @freelog/freelog-cli create freelog-widget-app
cd freelog-widget-app
npm run dev
```

脚手架共提供4种项目模版：
1. **natural**: 不支持无任何前端框架
2. **react**: 支持使用react框架
3. **react-ts**: 支持使用react框架、支持typescript语法
4. **vue**: 支持vue框架

![项目模板](http://freelog-image.oss-cn-shenzhen.aliyuncs.com/freelog-cli-tmpl.jpg) 

![项目创建](http://freelog-image.oss-cn-shenzhen.aliyuncs.com/freelog-cli-create.jpg)


### 支持的语言特性
支持最新Javascript标准，支持ES6语法，除此之外：

- Exponentiation Operator (ES2016).
- Async/await (ES2017).
- Object Rest/Spread Properties (ES2018).
- Class Fields and Static Properties (part of stage 3 proposal).
- JSX, Flow and TypeScript.





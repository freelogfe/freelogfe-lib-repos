#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const pkg = require('./package.json')
const fs= require('fs-extra')
const logger = require('./lib/logger')
const scripts = require('./lib')
const updateNotifier = require('update-notifier')
const CWD = process.cwd()

program
  .version(pkg.version, '-v, --version');

program.command('init')
  .description('创建ci.conf.js模板')
  .action(function () {
    const src = path.join(__dirname, 'template', 'default.ci.conf.js');
    const dest = path.join(CWD, 'ci.conf.js');
    try {
      if (fs.existsSync(dest)) {
        logger.warn(dest + ' 已存在ci.conf.js配置文件');
      } else {
        fs.copySync(src, dest);
        logger.success('创建ci.conf.js成功');
      }
    } catch (err) {
      logger.error(err);
    }
  });

program.command('deploy')
  .description('部署前端代码到alioss')
  .option('-e, --env [value]', '部署环境，例如beta或生产环境')
  .option('-d, --dir [value]', '发布到oss上的目录名')
  .action(function (opts) {
    scripts.deploy(opts)
  });

program.command('clear [env]')
  .description('清除alioss文件')
  .option('-i, --interact', '交互式删除')
  .option('-d, --date [value]', '过期时间')
  .action(function (env, opts) {
    opts.env = env
    scripts.clear(opts)
  });

process.on('uncaughtException', function (err) {
  logger.error(err);
  checkLatestVersion();
});

process.on('unhandledRejection', function (err) {
  logger.error(err);
  exit(1)
});

function checkLatestVersion() {
  var notifier = updateNotifier({pkg});
  if (notifier.update) {
    logger.warn(`Update available: ${notifier.update.latest}`);
  }
}

program
  .command('*')
  .action(function () {
    logger.error('命令有误,请检查');
    program.outputHelp();
    checkLatestVersion();
  });

checkLatestVersion();
program.parse(process.argv);

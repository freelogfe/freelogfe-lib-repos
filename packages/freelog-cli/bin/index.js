#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const updateNotifier = require('update-notifier');
const generate = require('../lib/commands/generateor')
const {publish} = require('../lib/commands/publish')
const pkg = require('../package.json')

program.version(pkg.version)

/**
 * scaffold to init widget
 */
program
  .command('init [target]')
  .description('create a new freelog widget project')
  .option('-t, --templatePath [value]', 'init with local template')
  .option('-d, --destPath [value]', 'destination path for generating')
  .action(function (target, options) {
    if (options.templatePath) {
      options.templateTarget = path.resolve(options.templatePath)
    } else if (target) {
      options.templateTarget = target
    }
    generate(options)
  });

program
  .command('getenv')
  .description('get latest page env for dev')
  .action(async () => {
    const getenv = require('../lib/commands/generate-page-template');
    try {
      await getenv();
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('login')
  .description('login and get cookies and user info')
  .action(async () => {
    const {login} = require('../lib/commands/get-auth-info');
    try {
      await login();
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('upload')
  .description('upload the widget')
  .action(async () => {
    const upload = require('../lib/commands/upload-resource');
    try {
      await upload();
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('release')
  .description('upload and release widget')
  .action(async () => {
    const release = require('../lib/commands/release-resource');

    try {
      await release();
    } catch (e) {
      console.error(e);
    }
  });

/**
 * create a new widget
 *
 */
program
  .command('create [widgetName]')
  .description('create a new freelog widget project')
  .option('-d, --destPath [value]', 'destination path for generating')
  .action((widgetName, options) => {
    console.log('widgetName -', widgetName, options)
  })


/**
 * publish freelog widget to freelog assets
 * env: beta/prod
 */
program
  .command('publish [env]')
  .description('publish widget to freelog server')
  .option('-t, --type [value]', 'resource type')
  .option('-d, --desc [value]', 'resource name')
  .option('-f, --file [value]', 'resource file path')
  .option('-m, --meta [value]', 'the path of meta config')
  .action(function (env, options) {
    env = env || 'prod'
    publish(options, env)
  })


program.on('--help', () => {
  console.log(`  Usages:
    ${chalk.gray('# create a new freelog widget project')}
    $ freelog-cli init
    ${chalk.gray('# publish widget to freelog server')}
    $ freelog-cli publish
  `)
})

// error on unknown commands
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  program.outputHelp();
  checkLatestVersion();
  process.exit(1);
});


process.on('uncaughtException', function (err) {
  console.log(err);
  checkLatestVersion();
});

process.on('unhandledRejection', function (err) {
  console.log(err);
  exit(1)
});

function help() {
  checkLatestVersion();
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}


function checkLatestVersion() {
  var notifier = updateNotifier({pkg});
  if (notifier.update) {
    console.log(`Update available: ${notifier.update.latest}`);
  }
}

help()

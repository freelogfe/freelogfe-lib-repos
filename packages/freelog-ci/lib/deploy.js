const walk = require('walk')
const oss = require('ali-oss')
const ora = require('ora');
const path = require('path')
const {execSync} = require('child_process')

const {getDeployConfig, getOssConfig} = require('./get-config')
const logger = require('./logger')
const CWD = process.cwd()

function build(opts) {
  const spinner = ora(`building for ${opts.env}...`).start();
  var res
  try {
    logger.debug(opts.cmd)
    res = execSync(opts.cmd, {
      cwd: CWD
    })
  } catch (e) {
    handleError(e)
  }
  spinner.succeed('build complete')
  return res.toString().includes('Build complete')
}

function uploadDir(opts) {
  return new Promise(resolve => {
    var walker = walk.walk(opts.local);
    var promises = []
    const ossConfig = getOssConfig(opts)
    const store = oss(ossConfig)
    logger.debug(ossConfig)

    walker.on('file', (root, fileState, next) => {
      const localFile = path.join(root, fileState.name)
      const target = path.relative(opts.local, localFile)
      if (/\.DS_Store$/.test(target)) {
        next()
        return 
      } else if (/\.html$/.test(target)){
        const promise = store.put((opts.path || '') + target, localFile)
        promises.push(promise)
      } else {
        const promise = store.put((opts.path || '') + target, localFile, {
          headers: {
            'Cache-Control': 'public,max-age=31536000'
          }
        })
        promises.push(promise)
      }
      next()
    })

    walker.on("end", function () {
      Promise.all(promises).then(resolve)
    })
  })
}

async function deploy(opts) {
  const deployConfig = getDeployConfig(opts)
  logger.debug(deployConfig)

  if (deployConfig) {
    build(deployConfig)
    const spinner = ora('publish...').start();
    await uploadDir(deployConfig)
    spinner.succeed(`publish to ${deployConfig.env} complete`)

    if (deployConfig.after) {
      execSync(deployConfig.after, {
        cwd: CWD
      })
    }
  }
}

function handleError(err) {
  logger.error(err.stdout.toString())
  logger.error(err.stderr.toString())
  process.exit(1)
}


process.on('uncaughtException', handleError)

module.exports = deploy
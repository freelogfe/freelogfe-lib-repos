module.exports = {
  "questions": {
    "name": {
      type: "string",
      required: true,
      label: "widget name",
      validate: function (name) {
        const NAME_REG = /^freelog-[a-z0-9._-]{4,15}-[a-z0-9._-]{4,64}$/
        var done = this.async();
        if (NAME_REG.test(name)) {
          done(null, true)
        } else {
          done('不符合widget命名规则，规则：/^freelog-[a-z0-9._-]{4,15}-[a-z0-9._-]{4,64}$/')
        }
      }
    },
    "enableShadowDom": {
      type: "confirm",
      required: true,
      label: "enable shadow dom"
    },
    "description": {
      type: "string",
      required: true,
      label: "widget description",
      "default": "A freelog widget"
    },
    "author": {
      type: "string",
      label: "Author",
    },
    "license": {
      type: "string",
      label: "License",
      "default": "MIT"
    }
  },
  complete: function (data, {logger, chalk}) {
    var msg = chalk.green('freelog component 初始化完成')
    logger.success(`${msg} ${chalk.gray(data.destDirName)}`)
    logger.log(`
                    $ cd ${data.destDirName}
                    $ npm install
                    $ npm run dev`)
  }
}
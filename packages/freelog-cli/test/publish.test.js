const {publish, PublishClient} = require('../lib/commands/publish')
const path = require('path')
const dirname = __dirname

describe('test publish', function () {
  it('test publish client', async function () {
    const file = path.join(dirname, './fixtures/resource.md')
    var resource = {
      filePath: file,
      resourceName: 'test publish widget',
      type: 'widget',
      meta: {
        version: "0.0.7",
        widgetName: "freelog-testing-publish"
      },
      policyText: `for public:
  initial:
    active
      terminate
`
    };

    var client = new PublishClient({
      username: 'src@freelog.com',
      password: '123456'
    })

    var res = await client.publish(resource, false)
  })
})

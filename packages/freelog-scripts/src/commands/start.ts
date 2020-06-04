import {Command, flags} from '@oclif/command';
import * as webpack from 'webpack';
// import cli from 'cli-ux'
import * as WebpackDevServer from 'webpack-dev-server';
import configFactory from '../utils/configFactory';

export default class Hello extends Command {
  static description = 'start dev server';

  static examples = [
    `$ freelog-scripts start
generate page template success
`,
  ];

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // };
  //
  // static args = [{name: 'file'}];

  async run() {
    run();
  }
}

function run() {
  const config: any = configFactory();
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);

  devServer.listen(config.devServer.port, '', async (err) => {
    if (err) {
      return console.error(err);
    }

    // cli.open('http://localhost:' + config.devServer.port);
    // const open = require('open');
    // await open('http://localhost:9010/');
  });
}



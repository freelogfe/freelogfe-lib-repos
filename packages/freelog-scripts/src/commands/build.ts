import {Command} from '@oclif/command';
import * as webpack from 'webpack';
import configFactory from '../utils/configFactory';

export default class Hello extends Command {
  static description = 'build widget';

  static examples = [
    `$ freelog-scripts build
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
  const config = configFactory('production');
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    console.log(err, stats);
  });
}

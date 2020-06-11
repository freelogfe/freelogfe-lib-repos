import {Command, flags} from '@oclif/command';
import * as webpack from 'webpack';
// import cli from 'cli-ux'
import * as WebpackDevServer from 'webpack-dev-server';
import configFactory from '../utils/configFactory';
import * as net from 'net';
import {colorLog} from '../config';
import {run as getenv} from './getenv';

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

async function run() {
  await getenv();
  const config: any = configFactory();
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);

  try {
    const port: unknown = await getAvailablePort(config.devServer.port) || 3000;
    devServer.listen(Number(port), '', async (err) => {
      if (err) {
        return colorLog.error(JSON.stringify(err));
      }
    });
  } catch (e) {
    colorLog.error(JSON.stringify(e));
  }

}

// function portIsOccupied(port) {
function getAvailablePort(port: number) {

  return new Promise(((resolve, reject) => {
    const server = net.createServer().listen(port);

    server.on('listening', function () {
      server.close();
      resolve(port);
    });

    server.on('error', function (err: any) {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
        return;
      }
      reject(err);
    });
  }));

}


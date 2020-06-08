import {Command, flags} from '@oclif/command';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import cli from 'cli-ux';

import download from './download';
import question from './question';

class CreateFreelogApp extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  };

  // static args = [{name: 'file'}];

  async run() {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'freelog-'));
    try {
      await download('freelogfe/freelog-widget-template', tmpDir);
      const answers = await question(tmpDir);
      console.log(answers, 'answers');
    } catch (e) {
      console.error(e);
    } finally {
      await cli.wait(3000);
      fs.removeSync(tmpDir);
    }
  }
}

export = CreateFreelogApp;

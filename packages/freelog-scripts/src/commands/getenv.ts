import {Command, flags} from '@oclif/command';
import axios from 'axios';
// import * as fs from 'fs';
import * as fs from 'fs-extra';
import {aliyuncsPagebuildUrl, colorLog} from '../config';
import * as path from "path";
import * as os from "os";
import {setStorage} from '../utils/storage';

export default class Getenv extends Command {
  static description = 'generate page template';

  static examples = [
    `$ freelog-scripts getenv
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
    await run();
  }
}

export async function run() {
  const {data: templateString} = await axios.get(aliyuncsPagebuildUrl);

  const authInfo = {
    "__auth_node_id__": 80000041,
    "__auth_node_name__": "video1234",
    "__page_build_id": "5de4ad76a7feab00202da8ec",
    "__page_build_entity_id": "5de4ad76a7fe",
    "__page_build_sub_releases": [{
      "id": "5de4acd4cb81ea002b223ee3",
      "name": "12345676789/freelog-video-player",
      "type": "release",
      "resourceType": "widget"
    }]
  };
  const html = templateString
    .replace(`<!-- authInfo -->`, `<script>const authInfo = ${JSON.stringify(authInfo)}</script>`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'freelog-'));
  process.on('beforeExit', function () {
    fs.removeSync(tmpDir);
  });
  process.on('SIGINT', function () {
    fs.removeSync(tmpDir);
    process.exit();
  });

  const htmlPath = path.join(tmpDir, 'index.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  setStorage({templatePath: htmlPath});
  colorLog.success('generate page template success');
  return htmlPath;
}

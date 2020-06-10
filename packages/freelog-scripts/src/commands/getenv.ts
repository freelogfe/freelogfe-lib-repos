import {Command, flags} from '@oclif/command';
import axios from 'axios';
import * as fs from 'fs';
import {aliyuncsPagebuildUrl, colorLog} from '../config';

export default class Hello extends Command {
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

    const {data: templateString} = await axios.get(aliyuncsPagebuildUrl);

    const html = templateString
      // .replace(/(?<=<div id="js-page-container">)[\s\S]*?(?=<\/div>)/, `<%= require('html-loader!./them-template.html') %>`)
      // .replace(`<!-- pbFragment -->`, `<%= require('html-loader!./them-template.html') %>`)
      .replace(`<!-- authInfo -->`, `<%= require('html-loader!./__auth_info__.html') %>`)
    ;

    if (!fs.existsSync('public') || fs.statSync('public').isFile()) {
      fs.mkdirSync('public');
    }

    fs.writeFileSync('public/index.html', html, 'utf-8');
    colorLog.success('generate page template success');

    // const {args, flags} = this.parse(Hello)
    //
    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}

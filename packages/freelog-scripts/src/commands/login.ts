import {Command, flags} from '@oclif/command'
import * as fs from 'fs';
import axios from 'axios';
import * as os from 'os';
import * as path from 'path';
import * as inquirer from 'inquirer';
import {colorLog, serverOrigin} from '../config';

const questions = [
  {
    type: 'input',
    name: 'username',
    message: "Enter a freelog username: "
  },
  {
    type: 'password',
    message: 'Enter a freelog password',
    name: 'password',
  },
];

export default class Hello extends Command {
  static description = 'freelog login';

  static examples = [
    `$ freelog-scripts login
`,
  ];

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }
  //
  // static args = [{name: 'file'}]

  async run() {
    return login();
    // const {args, flags} = this.parse(Hello)
    //
    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}

const freelogDir = path.resolve(os.homedir(), '.freelog/');
const authInfoPath = path.resolve(freelogDir, 'authInfo.json');

async function login() {
  let response;

  while (true) {
    const answers = await inquirer.prompt(questions);
    response = await axios.post(serverOrigin + '/v1/passport/login', {
      isRememer: 1,
      loginName: answers.username,
      password: answers.password,
    });

    if (response.data.ret === 0 && response.data.errcode === 0) {
      break;
    }

    colorLog.error('Invalid username or password !!!');
  }

  const cookies = response.headers['set-cookie'][0];

  const content = {
    cookies,
    userInfo: response.data.data,
  };

  if (!fs.existsSync(freelogDir)) {
    fs.mkdirSync(freelogDir);
  }

  fs.writeFileSync(authInfoPath, JSON.stringify(content, null, 2), 'utf-8');

  colorLog.success('Login successfull !');
  return content;
}

export async function getCookies(forceLogin: boolean = false): Promise<string> {
  if (fs.existsSync(authInfoPath) && !forceLogin) {
    return JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies;
  }

  await login();
  // console.log(content, 'content');
  return getCookies();
}

export async function getUserInfo(forceLogin: boolean = false): Promise<any> {

  if (fs.existsSync(authInfoPath) && !forceLogin) {
    return JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).userInfo;
  }

  await login();
  return getUserInfo();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getCookies = void 0;
const command_1 = require("@oclif/command");
const fs = require("fs");
const axios_1 = require("axios");
const os = require("os");
const path = require("path");
const inquirer = require("inquirer");
const config_1 = require("../config");
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
class Logon extends command_1.Command {
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
exports.default = Logon;
Logon.description = 'freelog login';
Logon.examples = [
    `$ freelog-scripts login
`,
];
const freelogDir = path.resolve(os.homedir(), '.freelog/');
const authInfoPath = path.resolve(freelogDir, 'authInfo.json');
async function login() {
    let response;
    while (true) {
        const answers = await inquirer.prompt(questions);
        response = await axios_1.default.post(config_1.serverOrigin + '/v1/passport/login', {
            isRememer: 1,
            loginName: answers.username,
            password: answers.password,
        });
        if (response.data.ret === 0 && response.data.errcode === 0) {
            break;
        }
        config_1.colorLog.error('Invalid username or password !!!');
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
    config_1.colorLog.success('Login successfull !');
    return content;
}
async function getCookies(forceLogin = false) {
    if (fs.existsSync(authInfoPath) && !forceLogin) {
        return JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies;
    }
    await login();
    // console.log(content, 'content');
    return getCookies();
}
exports.getCookies = getCookies;
async function getUserInfo(forceLogin = false) {
    if (fs.existsSync(authInfoPath) && !forceLogin) {
        return JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).userInfo;
    }
    await login();
    return getUserInfo();
}
exports.getUserInfo = getUserInfo;

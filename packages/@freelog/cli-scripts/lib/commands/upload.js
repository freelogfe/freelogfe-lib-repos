"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const command_1 = require("@oclif/command");
const fs = require("fs");
const FormData = require("form-data");
const axios_1 = require("axios");
const crypto = require("crypto");
const login_1 = require("./login");
const config_1 = require("../config");
class Uploader extends command_1.Command {
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
        run();
        // const {args, flags} = this.parse(Hello)
        //
        // const name = flags.name ?? 'world'
        // this.log(`hello ${name} from ./src/commands/hello.ts`)
        // if (args.file && flags.force) {
        //   this.log(`you input --force and --file: ${args.file}`)
        // }
    }
}
exports.default = Uploader;
Uploader.description = 'upload and create resource';
Uploader.examples = [
    `$ freelog-scripts upload
`,
];
async function run() {
    if (!fs.existsSync(config_1.projectPackage.main)) {
        config_1.colorLog.error(`Please build ! Run 'npm run build'`);
        return null;
    }
    const fileSha1 = getFileSha1(config_1.projectPackage.main);
    const { data: resource } = await axios_1.default.get(config_1.serverOrigin + '/v1/resources/' + fileSha1, {
        headers: {
            'Cookie': await login_1.getCookies(),
        },
    });
    if (resource.ret !== 0 || resource.errcode !== 0) {
        config_1.colorLog.error(JSON.stringify(resource.msg, null, 2));
        return null;
    }
    if (resource.data) {
        const userInfo = await login_1.getUserInfo();
        if (userInfo.userId === resource.data.userId) {
            config_1.colorLog.success('Widget already uploaded !');
            return resource.data;
        }
        config_1.colorLog.error('Widget already exists !');
        return null;
    }
    // console.log('######');
    const result = await uploadWidget(config_1.projectPackage.main);
    const params = {
        aliasName: config_1.projectPackage.name,
        uploadFileId: result.uploadFileId,
    };
    const config = {
        headers: {
            'Cookie': await login_1.getCookies(),
        },
    };
    const { data } = await axios_1.default.post(config_1.serverOrigin + '/v1/resources', params, config);
    if (data.ret !== 0 || data.errcode !== 0) {
        config_1.colorLog.error(JSON.stringify(data.msg, null, 2));
        return null;
    }
    config_1.colorLog.success('Create resource successfull !');
    return data.data;
}
exports.run = run;
async function uploadWidget(filePath) {
    const form = new FormData();
    form.append('resourceType', 'widget');
    form.append('file', fs.createReadStream(filePath));
    const options = {
        method: 'post',
        url: config_1.serverOrigin + '/v1/resources/temporaryFiles/uploadResourceFile',
        data: form,
        headers: Object.assign(Object.assign({}, form.getHeaders()), { 'Cookie': await login_1.getCookies() }),
    };
    const { data } = await axios_1.default(options);
    if (data.ret !== 0 || data.errcode !== 0) {
        throw new Error(data.msg);
        return;
    }
    return data.data;
}
function getFileSha1(filePath) {
    const hash = crypto.createHash('sha1');
    const str = fs.readFileSync(filePath);
    hash.update(str);
    return hash.digest('hex');
}

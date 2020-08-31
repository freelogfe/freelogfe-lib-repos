"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const axios_1 = require("axios");
const semver = require("semver");
const login_1 = require("./login");
const config_1 = require("../config");
const upload_1 = require("./upload");
class Hello extends command_1.Command {
    // static flags = {
    //   help: flags.help({char: 'h'}),
    //   // flag with a value (-n, --name=VALUE)
    //   name: flags.string({char: 'n', description: 'name to print'}),
    //   // flag with no value (-f, --force)
    //   force: flags.boolean({char: 'f'}),
    // };
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
exports.default = Hello;
Hello.description = 'release resource';
Hello.examples = [
    `$ freelog-scripts release
`,
];
async function run() {
    const userInfo = await login_1.getUserInfo();
    const releaseName = userInfo.username + '/' + config_1.projectPackage.name;
    const config = {
        params: {
            releaseName,
        },
        headers: {
            'Cookie': await login_1.getCookies(),
        },
    };
    const { data } = await axios_1.default.get(config_1.serverOrigin + '/v1/releases/detail', config);
    if (data.data) {
        const publishedVersion = data.data.latestVersion.version;
        if (!semver.gt(config_1.projectPackage.version, publishedVersion)) {
            config_1.colorLog.error(`You cannot publish over the previously published version: ${publishedVersion} !`);
            config_1.colorLog.error(`Please update your 'version' field of 'package.json' !!!`);
            return null;
        }
        const result = await updateRelease(data.data);
        if (result === null) {
            return;
        }
        config_1.colorLog.success('Update release succeeded !');
    }
    else {
        const result = await newRelease();
        if (result === null) {
            return;
        }
        config_1.colorLog.success('Create release succeeded !');
    }
}
async function newRelease() {
    const resource = await upload_1.run();
    if (resource === null) {
        return null;
    }
    const params = {
        resourceId: resource.resourceId,
        releaseName: config_1.projectPackage.name,
        version: config_1.projectPackage.version,
        baseUpcastReleases: [],
        resolveReleases: [],
    };
    const config = {
        headers: {
            'Cookie': await login_1.getCookies(),
        },
    };
    const { data } = await axios_1.default.post(config_1.serverOrigin + '/v1/releases', params, config);
    if (data.ret !== 0 || data.errcode !== 0) {
        config_1.colorLog.error(JSON.stringify(data.ret.msg, null, 2));
        return null;
    }
    return data.data;
}
async function updateRelease(release) {
    const resource = await upload_1.run();
    if (resource === null) {
        return null;
    }
    const exitsResource = release.resourceVersions.map((i) => i.resourceId);
    if (exitsResource.includes(resource.resourceId)) {
        config_1.colorLog.error('The current release a version already exists for the resource !');
        config_1.colorLog.error('Cannot add duplicate !!!');
        return null;
    }
    const params = {
        resourceId: resource.resourceId,
        version: config_1.projectPackage.version,
        resolveReleases: [],
    };
    const config = {
        headers: {
            'Cookie': await login_1.getCookies(),
        },
    };
    const { data } = await axios_1.default.post(config_1.serverOrigin + `/v1/releases/${release.releaseId}/versions`, params, config);
    if (data.ret !== 0 || data.errcode !== 0) {
        config_1.colorLog.error(JSON.stringify(data.msg, null, 2));
        return null;
    }
    return data.data;
}

const fs = require('fs');
const axios = require('axios');
const semver = require('semver')

const {getUserInfo, getCookies} = require('./get-auth-info');
const {serverOrigin, projectPackage, colorLog} = require('../config');
const uploadResource = require('./upload-resource');

async function main() {
    const userInfo = await getUserInfo();

    const releaseName = userInfo.username + '/' + projectPackage.name;

    const config = {
        params: {
            releaseName,
        },
        headers: {
            'Cookie': await getCookies(),
        },
    };

    const {data} = await axios.get(serverOrigin + '/v1/releases/detail', config);
    if (data.data) {

        const publishedVersion = data.data.latestVersion.version;
        if (!semver.gt(projectPackage.version, publishedVersion)) {
            colorLog.error(`You cannot publish over the previously published version: ${publishedVersion} !`);
            colorLog.error(`Please update your 'version' field of 'package.json' !!!`);
            return null;
        }

        const result = await updateRelease(data.data);
        if (result === null) {
            return;
        }

        colorLog.success('Update release successfull !')
    } else {
        const result = await newRelease();
        if (result === null) {
            return;
        }
        colorLog.success('Create release successfull !')
    }

}

if (require.main === module) {
  main();
}

module.exports = main;

async function newRelease() {
    const resource = await uploadResource();

    if (resource === null) {
        return null;
    }

    const params = {
        resourceId: resource.resourceId,
        releaseName: projectPackage.name,
        version: projectPackage.version,
        baseUpcastReleases: [],
        resolveReleases: [],
    };

    const config = {
        headers: {
            'Cookie': await getCookies(),
        },
    };

    const {data} = await axios.post(serverOrigin + '/v1/releases', params, config);

    if (data.ret !== 0 || data.errcode !== 0) {
        colorLog.error(JSON.stringify(data.ret.msg, null, 2));
        return null;
    }

    return data.data;
}

async function updateRelease(release) {
    const resource = await uploadResource();

    if (resource === null) {
        return null;
    }

    const exitsResource = release.resourceVersions.map(i => i.resourceId);
    if (exitsResource.includes(resource.resourceId)) {
        colorLog.error('The current release a version already exists for the resource !');
        colorLog.error('Cannot add duplicate !!!');
        return null;
    }

    const params = {
        resourceId: resource.resourceId,
        version: projectPackage.version,
        resolveReleases: [],
    };
    const config = {
        headers: {
            'Cookie': await getCookies(),
        },
    };

    const {data} = await axios.post(serverOrigin + `/v1/releases/${release.releaseId}/versions`, params, config);

    if (data.ret !== 0 || data.errcode !== 0) {
        colorLog.error(JSON.stringify(data.msg, null, 2));
        return null;
    }

    return data.data;

}

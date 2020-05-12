const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const request = require('request');
const crypto = require('crypto');

const {getCookies, getUserInfo} = require('./get-auth-info');
const {serverOrigin, projectPackage, colorLog} = require('../config');


async function main() {

  if (!fs.existsSync(projectPackage.main)) {
    colorLog.error(`Please build ! Run 'npm run build'`);
    return null;
  }

  const fileSha1 = getFileSha1(projectPackage.main);
  const {data: resource} = await axios.get(serverOrigin + '/v1/resources/' + fileSha1, {
    headers: {
      'Cookie': await getCookies(),
    },
  });

  if (resource.ret !== 0 || resource.errcode !== 0) {
    colorLog.error(JSON.stringify(resource.msg, null, 2));
    return null;
  }

  if (resource.data) {

    const userInfo = await getUserInfo();
    if (userInfo.userId === resource.data.userId) {
      colorLog.success('Widget already uploaded !');
      return resource.data;
    }

    colorLog.error('Widget already exists !');
    return null;
  }

  // console.log('######');
  const result = await uploadWidget(projectPackage.main);
  const params = {
    aliasName: projectPackage.name,
    uploadFileId: result.uploadFileId,
  };

  const config = {
    headers: {
      'Cookie': await getCookies(),
    },
  };

  const {data} = await axios.post(serverOrigin + '/v1/resources', params, config);

  if (data.ret !== 0 || data.errcode !== 0) {
    colorLog.error(JSON.stringify(data.msg, null, 2));
    return null;
  }

  colorLog.success('Create resource successfull !');
  return data.data;

}

if (require.main === module) {
  main();
}

module.exports = main;

async function uploadWidget(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('resourceType', 'widget');

  const options = {
    method: 'post',
    url: serverOrigin + '/v1/resources/temporaryFiles/uploadResourceFile',
    data: form,
    headers: {
      ...form.getHeaders(),
      'Cookie': await getCookies(),
    },
  };

  const {data} = await axios(options);
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

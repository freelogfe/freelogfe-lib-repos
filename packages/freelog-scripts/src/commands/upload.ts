import {Command, flags} from '@oclif/command';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios, {AxiosStatic} from 'axios';
import * as crypto from 'crypto';

import {getCookies, getUserInfo} from './login';
import {serverOrigin, projectPackage, colorLog} from '../config';


export default class Uploader extends Command {
  static description = 'upload and create resource';

  static examples = [
    `$ freelog-scripts upload
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

export async function run() {

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

async function uploadWidget(filePath: string) {
  const form = new FormData();
  form.append('resourceType', 'widget');
  form.append('file', fs.createReadStream(filePath));

  const options: any = {
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

function getFileSha1(filePath: string) {
  const hash = crypto.createHash('sha1');
  const str = fs.readFileSync(filePath);
  hash.update(str);
  return hash.digest('hex');
}

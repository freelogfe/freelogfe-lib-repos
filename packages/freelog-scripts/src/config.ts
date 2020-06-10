import * as fs from 'fs';
// @ts-ignore
import * as chalkPipe from 'chalk-pipe';

export const serverOrigin: string = 'http://qi.testfreelog.com';

export const aliyuncsPagebuildUrl: string = 'http://test-frcdn.oss-cn-shenzhen.aliyuncs.com/pagebuild/index.html';

export const projectPackage = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

export const colorLog = {
  success: (str: string) => console.log(chalkPipe('green')(str)),
  error: (str: string) => console.log(chalkPipe('red')(str)),
  warning: (str: string) => console.log(chalkPipe('orange')(str)),
};

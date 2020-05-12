const fs = require('fs');
const chalkPipe = require('chalk-pipe');

exports.serverOrigin = 'http://qi.testfreelog.com';

exports.aliyuncsPagebuildUrl = 'http://test-frcdn.oss-cn-shenzhen.aliyuncs.com/pagebuild/index.html';

exports.projectPackage = JSON.parse(fs.readFileSync('package.json'));

exports.colorLog = {
    success: (str) => console.log(chalkPipe('green')(str)),
    error: (str) =>console.log(chalkPipe('red')(str)),
};

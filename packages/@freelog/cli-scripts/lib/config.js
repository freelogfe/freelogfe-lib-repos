"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServerProxy = exports.colorLog = exports.projectPackage = exports.aliyuncsPagebuildUrl = exports.serverOrigin = void 0;
const fs = require("fs");
// @ts-ignore
const chalkPipe = require("chalk-pipe");
exports.serverOrigin = 'http://qi.testfreelog.com';
exports.aliyuncsPagebuildUrl = 'http://test-frcdn.oss-cn-shenzhen.aliyuncs.com/pagebuild/index.dev.html';
exports.projectPackage = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
exports.colorLog = {
    success: (str) => console.log(chalkPipe('green')(str)),
    error: (str) => console.log(chalkPipe('red')(str)),
    warning: (str) => console.log(chalkPipe('orange')(str)),
};
exports.devServerProxy = {
    '/v1': {
        changeOrigin: true,
        target: 'http://qi.testfreelog.com'
    },
};

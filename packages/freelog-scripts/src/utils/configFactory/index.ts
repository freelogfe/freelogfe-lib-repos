import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';
import * as path from 'path';

export default function (env: 'production' | 'development' = 'development') {
  if (env === 'production') {
    try {
      const configFunc: any = require(path.join(process.cwd(), 'config/webpack.prod.js'));
      return configFunc(prodConfig);
    } catch (e) {
      return prodConfig;
    }
  }
  try {
    const configFunc: any = require(path.join(process.cwd(), 'config/webpack.dev.js'));
    return configFunc(devConfig);
  } catch (e) {
    return devConfig;
  }
}

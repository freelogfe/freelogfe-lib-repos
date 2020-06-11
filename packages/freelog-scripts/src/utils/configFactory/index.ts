import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import {getStorage} from '../storage';

export default function (env: 'production' | 'development' = 'development') {
  if (env === 'production') {
    try {
      const configFunc: any = require(path.join(process.cwd(), 'config/webpack.prod.js'));
      return configFunc(prodConfig);
    } catch (e) {
      return prodConfig;
    }
  }
  const webpackConfig = {
    ...devConfig,
  };

  webpackConfig.plugins?.push(new HtmlWebpackPlugin({
    template: getStorage().templatePath,
  }));
  try {
    const configFunc: any = require(path.join(process.cwd(), 'config/webpack.dev.js'));
    return configFunc(webpackConfig);
  } catch (e) {
    return webpackConfig;
  }
}

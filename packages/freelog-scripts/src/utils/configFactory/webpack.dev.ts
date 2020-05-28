import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import common from './webpack.common';
import * as path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');

export default merge(common, {
  output: {
    path: distDir,
    filename: 'webpack.bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distDir,
    hot: true,
    open: true,
    port: 3000,
    proxy: {
      '/v1': 'http://qi.testfreelog.com'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Production',
    }),
  ],
});

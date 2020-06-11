import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';
import {devServerProxy} from '../../config';

export default merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    proxy: devServerProxy,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      },
    }),
  ],
  mode: 'development',
});

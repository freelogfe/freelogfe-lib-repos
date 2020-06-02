import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import common from './webpack.common';

export default merge(common, {
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*']}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'build'),
  },
  mode: 'production',
});

const VueLoaderPlugin = require('vue-loader/lib/plugin');
import * as fs from 'fs';
import * as webpack from 'webpack';

export default {
  entry: {
    app: fs.existsSync('tsconfig.json') ? './src/index.tsx' : './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'raw-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'raw-loader',
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',

          ]
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

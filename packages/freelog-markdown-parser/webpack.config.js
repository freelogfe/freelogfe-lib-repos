
const webpack = require('webpack')
const path = require('path')
const CWD = process.cwd()

const appName = require(path.join(CWD, 'package.json')).name
const [ appEntry, appOutputPath ] = [ path.join(CWD, 'src/index.js'), path.join(CWD, 'dist') ]

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  mode: 'production',
  devtool: '#source-map',
  performance: {
    hints: false
  },
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  entry: path.join(CWD, 'markdown/index.js'), 
  output: {
    path: path.join(CWD, 'lib'),
    filename: 'markdown-parser.js',
  }, 
  resolve: {
    extensions: [ '.mjs', '.js', '.jsx','.json', '.wasm' ],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.((c|sa|sc|le)ss)$/i,
        use: [ 
          'style-loader', 
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader', 
        ],
      },
    ]
  },
  optimization: {
    concatenateModules: true,
    nodeEnv: 'production',
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
}

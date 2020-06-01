const VueLoaderPlugin = require('vue-loader/lib/plugin');

export default {
  entry: {
    app: './src/index.js',
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
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};

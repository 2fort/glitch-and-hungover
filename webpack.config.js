const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

const BASE_URL = 'http://localhost:3001';

module.exports = {
  entry: {
    dev: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:3001',
      'webpack/hot/only-dev-server',
    ],
    app: [
      './src/app.jsx',
    ],
  },

  output: {
    path: '/build',
    publicPath: '/',
    filename: '[hash].[name].js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]-[hash:10].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Комикс «Глюк и Отходняк»',
      template: './src/index.ejs',
      chunks: ['dev', 'app'],
      inject: 'body',
      filename: 'index.html',
      baseurl: BASE_URL,
      commitHash,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        IMG_FOLDER: JSON.stringify('/img/comics/'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],

  performance: { hints: false },
  devtool: 'source-map',

  devServer: {
    hot: true,
    contentBase: '/build',
    publicPath: '/',
    historyApiFallback: true,
    stats: 'minimal',
    port: 3001,
    proxy: {
      '/img/**': {
        target: 'http://localhost:3000',
      },
    },
  },
};

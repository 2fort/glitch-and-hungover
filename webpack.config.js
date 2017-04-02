const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      title: 'Глюк и Отходняк',
      template: './src/index.ejs',
      chunks: ['dev', 'app'],
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        IMG_L: JSON.stringify('/img/l/'),
        IMG_M: JSON.stringify('/img/m/'),
        IMG_S: JSON.stringify('/img/s/'),
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

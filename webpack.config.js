const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

const port = 3070;
const BASE_URL = `http://localhost:${port}`;

module.exports = {
  entry: {
    app: [
      './src/App.jsx',
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/only-dev-server',
    ],
  },

  output: {
    path: '/build',
    publicPath: '/',
    filename: 'js/[hash].[name].js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
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
        test: /\.(png|jpg|jpeg|gif)$/,
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
  ],

  performance: { hints: false },
  devtool: 'source-map',

  devServer: {
    hot: true,
    contentBase: '/build',
    publicPath: '/',
    historyApiFallback: true,
    stats: 'minimal',
    port,
    proxy: {
      '/img/**': {
        target: 'http://localhost:3000',
      },
    },
  },
};

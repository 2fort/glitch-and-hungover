const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString();

const BASE_URL = process.env.BASE_URL || 'http://glitch-hungover.dev';

module.exports = {
  entry: {
    app: ['./src/App.jsx'],
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              compact: true,
              plugins: [
                [
                  'transform-react-remove-prop-types',
                  {
                    ignoreFilenames: ['node_modules'],
                  },
                ],
              ],
              presets: [
                [
                  'env', {
                    targets: {
                      browsers: ['last 2 versions'],
                    },
                    loose: true, // ?
                    modules: false,
                    debug: true,
                  },
                ],
                'stage-2',
                'react',
              ],
            },
          },
        ],
      },
    ],
  },

  recordsPath: path.join(__dirname, 'records.json'),

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Комикс «Глюк и Отходняк»',
      template: './src/index.ejs',
      baseurl: BASE_URL,
      commitHash,
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        IMG_FOLDER: JSON.stringify('/img/comics/'),
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};

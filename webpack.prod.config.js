const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const BASE_URL = process.env.BASE_URL || 'http://glitch-hungover.dev';

function chunksSortModeExp(chunk1, chunk2, orders) {
  const order1 = orders.indexOf(chunk1.names[0]);
  const order2 = orders.indexOf(chunk2.names[0]);
  if (order1 > order2) {
    return 1;
  } else if (order1 < order2) {
    return -1;
  }
  return 0;
}

module.exports = {

  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'csstips',
      'csx',
      'typestyle',
    ],
    app: ['./src/app.jsx'],
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
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
      chunks: ['vendor', 'app'],
      baseurl: BASE_URL,
      inject: 'body',
      filename: 'index.html',
      chunksSortMode: (chunk1, chunk2) => {
        const order = ['vendor', 'app'];
        return chunksSortModeExp(chunk1, chunk2, order);
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        IMG_FOLDER: JSON.stringify('/img/comics/'),
      },
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};

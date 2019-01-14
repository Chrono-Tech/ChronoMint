/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babel = require('../babel.config.js')
const fs = require('fs')

process.noDeprecation = true
const isInNodeModules =
  path.basename(path.resolve(path.join(__dirname, '..', '..'))) ===
  'node_modules'

const relativePath = isInNodeModules ? '../../..' : '..'
const srcPath = path.resolve(__dirname, relativePath, 'src')
const srcAppArg = process.argv.find((e) => e.startsWith('--src-app='))
const srcApp = srcAppArg ? srcAppArg.substr('--src-app='.length) : 'index'

module.exports = {
  externals: {},
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://0.0.0.0:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, srcApp),
  ],
  target: 'web', // Make web variables accessible to webpack, e.g. window
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../packages/core/node_modules'),
      path.resolve(__dirname, '../packages/login/node_modules'),
    ],
    alias: {
      '@chronobank': path.resolve(__dirname, '../packages/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            ...babel,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              debug: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [
                require('postcss-cssnext')(),
                require('postcss-modules-values'),
              ],
            },
          },
          'sass-loader',
        ],
      },
     { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
      { test: /\.otf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [{ loader: 'url-loader', options: { limit: '10000', mimetype: 'application/font-woff' } }] },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'url-loader', options: { limit: '10000', mimetype: 'octet-stream' } }] },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: 'url-loader', options: { limit: '10000', mimetype: 'image/svg+xml' } }] },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                gifsicle: {
                  interlaced: true,
                },
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
     {
        test: /node_modules\/chronobank-smart-contracts\/build\/contracts\/.+\.json$/, // only ABI contracts
        loader: path.resolve('./config/abi-loader'),
        include: [
          path.resolve(
            'node_modules/chronobank-smart-contracts/build/contracts',
          ),
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
}

/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.new.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
const relativePath = isInNodeModules ? '../../..' : '..'
const modulesPath = path.resolve(__dirname, relativePath, 'node_modules')
const indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
const indexPresentationHtmlPath = path.resolve(
  __dirname,
  relativePath,
  'index-presentation.html',
)
const faviconPath = path.resolve(__dirname, relativePath, 'favicon.png')
const buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

module.exports = Object.assign({}, baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template:
        process.env.NODE_ENV === 'standalone'
          ? indexHtmlPath
          : indexPresentationHtmlPath,
      favicon: faviconPath,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      sync: [
        'chronomint-presentation/js/vendor.js',
        'dist/chronomint-presentation/js/index.js',
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      WEB3_RPC_LOCATION: '"' + process.env.WEB3_RPC_LOCATION + '"',
      PUBLIC_BACKEND_REST_URL:
        '"' +
        (process.env.PUBLIC_BACKEND_REST_URL ||
          'https://backend.chronobank.io') +
        '"',
    }),
    new MiniCssExtractPlugin('[name].[contenthash].css'),
    process.env.NODE_ENV === 'standalone'
      ? null
      : new CopyWebpackPlugin([
        {
          context: path.join(
            modulesPath,
            '@chronobank/chronomint-presentation/dist/chronomint-presentation',
          ),
          from: '**',
          to: path.join(buildPath, 'chronomint-presentation'),
        },
      ]),
    process.env.NODE_ENV === 'standalone'
      ? null
      : new HtmlWebpackIncludeAssetsPlugin({
        assets: [
          'chronomint-presentation/css/index.css',
          'chronomint-presentation/js/vendor.js',
          'chronomint-presentation/js/index.js',
        ],
        hash: true,
        append: false,
      }),
  ].filter((p) => p !== null),
  performance: {
    hints: false,
  },
})

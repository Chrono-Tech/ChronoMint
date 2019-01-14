/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseWebpackConfig = require('./webpack.new.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const path = require('path')
const fs = require('fs')

const isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
const buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')
let relativePath = isInNodeModules ? '../../..' : '..'
const modulesPath = path.resolve(__dirname, relativePath, 'node_modules')
const indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
const indexPresentationHtmlPath = path.resolve(__dirname, relativePath, 'index-presentation.html')
const faviconPath = path.resolve(__dirname, relativePath, 'favicon.png')
// creating i18nJson empty file for i18n
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath)
}
fs.writeFileSync(buildPath + '/i18nJson.js', 'var i18nJson = {}')

module.exports = Object.assign({}, baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
  },
  devServer: {
    host: '127.0.0.1',
    https: true,
    port: '3000',
    contentBase: path.join(__dirname, '../dist'),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    inline: true,
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(['../dist']),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      PUBLIC_BACKEND_REST_URL: '"' + (process.env.PUBLIC_BACKEND_REST_URL || 'https://backend.chronobank.io') + '"',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath,
    }),
    process.env.NODE_ENV === 'standalone'
      ? null
      : new CopyWebpackPlugin([
        {
          context: path.resolve(__dirname, '../node_modules/@chronobank/chronomint-presentation/dist/chronomint-presentation'),
          from: '**',
          to: path.resolve(__dirname, '../dist/chronomint-presentation'),
        },
      ]),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      sync: [
        'chronomint-presentation/js/vendor.js',
        'chronomint-presentation/js/index.js',
      ],
    }),
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
  ],
  performance: {
    hints: false,
  },
})

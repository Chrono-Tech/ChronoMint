const path = require('path')
const webpack = require('webpack')
const babel = require('./babel.prod')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const config = require('./webpack.config.base.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = config.buildConfig(
  ({ srcPath, modulesPath, buildPath, indexPresentationHtmlPath, faviconPath }) => ({
    entry: path.join(srcPath, 'index'),
    output: {
      path: buildPath,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },
    babel,
    plugins: [
      new HtmlWebpackPlugin({
        inject: 'head',
        template: indexPresentationHtmlPath,
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
        sync: ['chronomint-presentation/js/vendor.js', 'chronomint-presentation/js/index.js'],
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
        WEB3_RPC_LOCATION: '"' + process.env.WEB3_RPC_LOCATION + '"',
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
      new CopyWebpackPlugin([
        {
          context: path.join(modulesPath, '@chronobank/chronomint-presentation/dist/chronomint-presentation'),
          from: '**',
          to: path.join(buildPath, 'chronomint-presentation'),
        },
      ]),
      new HtmlWebpackIncludeAssetsPlugin({
        assets: [
          'chronomint-presentation/css/index.css',
          'chronomint-presentation/js/vendor.js',
          'chronomint-presentation/js/index.js',
        ],
        hash: true,
        append: false,
      }),
    ],
  })
)

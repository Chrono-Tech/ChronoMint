/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const path = require('path')
const webpack = require('webpack')
const babel = require('./babel.dev')
const CompileTimePlugin = require('webpack-compile-time-plugin');

const config = require('./webpack.config.base.js')

const HtmlWebpackPlugin = require('html-webpack-plugin')

process.traceDeprecation = true

const srcAppArg = process.argv.find((e) => e.startsWith('--src-app='))
const srcApp = srcAppArg ? srcAppArg.substr('--src-app='.length) : 'index'

module.exports = config.buildConfig(
  ({ srcPath, buildPath, indexHtmlPath, faviconPath }) => ({
    devtool: process.env.SOURCE_MAP || 'source-map',
    entry: [
      require.resolve('webpack-dev-server/client') + '?http://0.0.0.0:3000',
      require.resolve('webpack/hot/dev-server'),
      path.join(srcPath, srcApp),
    ],
    output: {
      // Next line is not used in dev but WebpackDevServer crashes without it:
      path: buildPath,
      pathinfo: true,
      filename: 'bundle.js',
      publicPath: '/',
    },
    babel,
    plugins: [
      new CompileTimePlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: indexHtmlPath,
        favicon: faviconPath,
      }),
      new webpack.ProvidePlugin({
        'Web3': 'web3',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
        'process.env.BASE_SCHEMA': `"${process.env.BASE_SCHEMA || 'https'}"`,
        PUBLIC_BACKEND_REST_URL: null, // will be used a default param in the code
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  }),
)

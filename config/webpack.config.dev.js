/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const path = require('path')
const webpack = require('webpack')
const babel = require('./babel.dev')
const CompileTimePlugin = require('webpack-compile-time-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

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
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
      publicPath: '/',
    },
    babel,
    plugins: [
      new CircularDependencyPlugin({
        // `onStart` is called before the cycle detection starts
        onStart ({ compilation }) {
          console.log('start detecting webpack modules cycles')
        },
        // `onDetected` is called for each module that is cyclical
        onDetected ({ module: webpackModuleRecord, paths, compilation }) {
          if (!/node_modules/.test(webpackModuleRecord.resource)) {
            compilation.errors.push(new Error(paths.join(' -> ')))
          }
        },
        // `onEnd` is called before the cycle detection ends
        onEnd ({ compilation }) {
          console.log('end detecting webpack modules cycles')
        },
      }),
      new CompileTimePlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: indexHtmlPath,
        favicon: faviconPath,
      }),
      new FilterWarningsPlugin({
        exclude: /Critical dependency: the request of a dependency is an expression/
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'src',
        minChunks: (m) => [
          /packages\/core/,
          /packages\/login/,
          /packages\/login-ui/,
          /src/,
        ].map(regExp => regExp.test(m.context)).includes(true)
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

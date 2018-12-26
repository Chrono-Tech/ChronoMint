/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

// import webpack from 'webpack'
const HtmlWebpackPlugin = require('html-webpack-plugin')
// import CircularDependencyPlugin from 'circular-dependency-plugin'
// import CleanWebpackPlugin from 'clean-webpack-plugin'
const  baseWebpackConfig = require('./webpack.new.base')
// import CleanTerminalPlugin from 'clean-terminal-webpack-plugin'
const path = require('path')

module.exports = Object.assign({}, baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
    // path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  },
  devServer: {
    host: '127.0.0.1',
    https: true,
    port: '3000',
    contentBase: path.join(__dirname, '../dist'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // publicPath: '/dist',
    hot: true,
    inline: true,
    historyApiFallback: true
  },
  plugins: [
    // new CleanWebpackPlugin(['../dist']),
    // new CleanTerminalPlugin({
    //   message: 'Clean up...'
    // }),
    // new CircularDependencyPlugin({
    //   exclude: /node_modules/,
    //   failOnError: true
    // }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    })
  ],
  performance: {
    hints: false
  }
})

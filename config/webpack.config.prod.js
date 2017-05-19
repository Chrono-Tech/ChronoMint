let path = require('path')
let precss = require('precss')
let autoprefixer = require('autoprefixer')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
let isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) ===
  'node_modules'
let relativePath = isInNodeModules ? '../../..' : '..'
if (process.argv[2] === '--debug-template') {
  relativePath = '../template'
}
let srcPath = path.resolve(__dirname, relativePath, 'src')
let nodeModulesPath = path.join(__dirname, '..', 'node_modules')
let indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
let faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico')
let buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: path.join(srcPath, 'index'),
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    // TODO: this wouldn't work for e.g. GH Pages.
    // Good news: we can infer it from package.json :-)
    publicPath: '/'
  },
  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    alias: {
      contracts: path.resolve('contracts')
    }
  },
  resolveLoader: {
    root: [nodeModulesPath, path.resolve('lib/webpack-loaders')],
    moduleTemplates: ['*-loader']
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      /*    {
       test: /\.js$/,
       include: srcPath,
       loader: 'react-hot-loader/webpack'
       }, */
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel',
        query: require('./babel.prod')
      },
      {
        test: /\.css$/,
        include: srcPath,
        loader: 'style!css!postcss'
      },
      /* {
       test: /\.css$/,
       loader: 'style!css?modules',
       include: /flexboxgrid/,
       }, */
      {test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap']},
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|ttf|woff|woff2)$/,
        loader: 'file'
      },
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=1000&mimetype=image/svg+xml'},
      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000'
      },
      {
        test: /\.sol/,
        loader: 'truffle-solidity'
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath,
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
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      WEB3_RPC_LOCATION: '"' + process.env.WEB3_RPC_LOCATION + '"'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new ExtractTextPlugin('[name].[contenthash].css')
  ]
}

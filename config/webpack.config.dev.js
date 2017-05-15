var path = require('path')
var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var precss = require('precss')
process.traceDeprecation = true 

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
var isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
var relativePath = isInNodeModules ? '../../..' : '..'
var isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
)

if (isInDebugMode) {
  relativePath = '../template'
}

var srcPath = path.resolve(__dirname, relativePath, 'src')
// var nodeModulesPath = path.join(__dirname, '..', 'node_modules')
var indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
var faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico')
var buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

var provided = {
  'Web3': 'web3'
}

module.exports = {
  devtool: 'source-map',
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://0.0.0.0:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, 'index')
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: buildPath,
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      srcPath,
      "node_modules"
    ]
    //extensions: ['', '.js']
    // alias: {
    //   contracts: path.resolve('contracts')
    // }
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
	enforce: "pre",
        loader: 'eslint-loader',
        include: srcPath
      },
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel-loader',
        query: require('./babel.dev')
      },
      {
        test: /(\.css|\.scss)$/,
	use: [
		{ loader: 'style-loader', options: { sourceMap: true } },
		{ loader: 'css-loader', options: { sourceMap: true } },
		{ loader: 'postcss-loader', options: { sourceMap: true, config: {
		      path: './config/postcss.config.js'
		} } },
		{ loader: 'sass-loader', options: { sourceMap: true } }
	]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader'
      },
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [{loader: 'url-loader', options: { limit: '10000', mimetype: 'application/font-woff'}}]},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [{loader: 'url-loader', options: { limit: '10000', mimetype: 'octet-stream'}}]},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [{loader: 'url-loader', options: { limit: '10000', mimetype: 'image/svg+xml'}}]}
      // {
      //   test: /\.sol/,
      //   loader: 'truffle-solidity'
      // }
   ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: indexHtmlPath,
      favicon: faviconPath
    }),
    new webpack.ProvidePlugin(provided),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

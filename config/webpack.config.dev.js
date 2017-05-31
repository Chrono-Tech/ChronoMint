let path = require('path')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')
process.traceDeprecation = true

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
let isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
let relativePath = isInNodeModules ? '../../..' : '..'
let isInDebugMode = process.argv.some(arg =>
  arg.indexOf('--debug-template') > -1
)

if (isInDebugMode) {
  relativePath = '../template'
}

let srcPath = path.resolve(__dirname, relativePath, 'src')
// let nodeModulesPath = path.join(__dirname, '..', 'node_modules')
let indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
let faviconPath = path.resolve(__dirname, relativePath, 'favicon.ico')
let buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

let provided = {
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
      'node_modules'
    ]
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
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
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: true, config: { path: './config/postcss.config.js' } } },
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
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'application/font-woff' } } ] },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'octet-stream' } } ] },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'image/svg+xml' } } ] }
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

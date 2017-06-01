let path = require('path')
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
    modules: [
      srcPath,
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
    alias: {
      '@': path.join(__dirname, '..', 'src')
    }
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: srcPath,
        loader: 'babel-loader',
        query: require('./babel.prod')
      },
      {
        test: /(\.scss)$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true, modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]' } },
          {
            loader: 'postcss-loader', options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [
                require('postcss-cssnext')(),
                require('postcss-modules-values')
              ]
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true, outputStyle: 'expanded' } }
        ]
      },
      {
        test: /(\.css)$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true, modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]' } },
          {
            loader: 'postcss-loader', options: {
              sourceMap: true,
              plugins: () => [
                require('postcss-cssnext')(),
                require('postcss-modules-values')
              ]
            }
          }
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
      { test: /\.otf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'application/font-woff' } } ] },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'octet-stream' } } ] },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'image/svg+xml' } } ] }
    ]
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

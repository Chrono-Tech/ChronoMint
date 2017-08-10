let path = require('path')
let webpack = require('webpack')

let config = require('./webpack.config.base.js')

let HtmlWebpackPlugin = require('html-webpack-plugin')

process.traceDeprecation = true

module.exports = config.buildConfig(
  ({ srcPath, buildPath, indexHtmlPath, faviconPath }) => ({
    entry: [
      require.resolve('webpack-dev-server/client') + '?http://0.0.0.0:3000',
      require.resolve('webpack/hot/dev-server'),
      path.join(srcPath, 'index')
    ],
    output: {
      // Next line is not used in dev but WebpackDevServer crashes without it:
      path: buildPath,
      pathinfo: true,
      filename: 'bundle.js'
    },
    babel: require('./babel.dev'),
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: indexHtmlPath,
        favicon: faviconPath
      }),
      new webpack.ProvidePlugin({
        'Web3': 'web3'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  })
)

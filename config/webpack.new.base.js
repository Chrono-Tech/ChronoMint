/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babel = require('../babel.config.js')
const fs = require('fs')

process.noDeprecation = true
const isInNodeModules =
  path.basename(path.resolve(path.join(__dirname, '..', '..'))) ===
  'node_modules'
const buildPath = path.join(
  __dirname,
  isInNodeModules ? '../../..' : '..',
  'dist',
)

// creating i18nJson empty file for i18n
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath)
}
fs.writeFileSync(buildPath + '/i18nJson.js', 'var i18nJson = {}')
const relativePath = isInNodeModules ? '../../..' : '..'
const srcPath = path.resolve(__dirname, relativePath, 'src')
const srcAppArg = process.argv.find((e) => e.startsWith('--src-app='))
const srcApp = srcAppArg ? srcAppArg.substr('--src-app='.length) : 'index'

module.exports = {
  externals: {},
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  entry: [
    require.resolve('webpack-dev-server/client') + '?http://0.0.0.0:3000',
    require.resolve('webpack/hot/dev-server'),
    path.join(srcPath, srcApp),
  ],
  target: 'web', // Make web variables accessible to webpack, e.g. window
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      'node_modules',
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../packages/core/node_modules'),
      path.resolve(__dirname, '../packages/login/node_modules'),
    ],
    alias: {
      '@chronobank': path.resolve(__dirname, '../packages/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            ...babel,
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              debug: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [
                require('postcss-cssnext')(),
                require('postcss-modules-values'),
              ],
            },
          },
          'sass-loader',
        ],
      },
      /*{
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              import: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              ident: 'postcss',
              plugins: () => [require('postcss-cssnext')(), require('postcss-modules-values')],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              outputStyle: 'expanded',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },*/
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                gifsicle: {
                  interlaced: true,
                },
                mozjpeg: {
                  progressive: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      // {
      //   test: /(?!node_modules\/chronobank-smart-contracts\/build\/contracts\/).+\.json$/, // all JSON files except contracts
      //   loader: 'json-loader',
      //   exclude: [
      //     path.resolve('node_modules/chronobank-smart-contracts/build/contracts')
      //   ]
      // },
      {
        test: /node_modules\/chronobank-smart-contracts\/build\/contracts\/.+\.json$/, // only ABI contracts
        loader: path.resolve('./config/abi-loader'),
        include: [
          path.resolve(
            'node_modules/chronobank-smart-contracts/build/contracts',
          ),
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
}

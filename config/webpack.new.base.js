/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babel = require('./babel.dev')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

process.noDeprecation = true

module.exports = {
  externals: {
    fs: 'fs',
    net: 'net',
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  target: 'web', // Make web variables accessible to webpack, e.g. window
  resolve: {
    modules: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../node_modules'),
        path.resolve(__dirname, '../packages/core/node_modules'),
        path.resolve(__dirname, '../packages/login/node_modules'),
    ],
    alias: {
      // Resolving '@import "~styles/..." inside scss files
      // redux: path.resolve(__dirname, '../src/redux/'),
      '@chronobank': path.resolve(__dirname, '../packages/'),
    //   pages: path.resolve(__dirname, '../src/pages/'),
    //   menu: path.resolve(__dirname, '../src/menu/'),
    //   layouts: path.resolve(__dirname, '../src/layouts/'),
    //   components: path.resolve(__dirname, '../src/components/'),
    //   assets: path.resolve(__dirname, '../src/assets/'),
    //   styles: path.resolve(__dirname, '../src/styles/'),
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
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              debug: true,
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
        include: [path.resolve('node_modules/chronobank-smart-contracts/build/contracts')],
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

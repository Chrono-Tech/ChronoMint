/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const path = require('path')
const fs = require('fs')

process.traceDeprecation = true

// TODO: hide this behind a flag and eliminate dead code on eject.
// This shouldn't be exposed to the user.
const isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
let relativePath = isInNodeModules ? '../../..' : '..'

const isInDebugMode = process.argv.some((arg) =>
  arg.indexOf('--debug-template') > -1
)

if (isInDebugMode) {
  relativePath = '../template'
}

const srcPath = path.resolve(__dirname, relativePath, 'src')
const modulesPath = path.resolve(__dirname, relativePath, 'node_modules')
const packagesPath = path.resolve(__dirname, relativePath, 'packages')
const indexHtmlPath = path.resolve(__dirname, relativePath, 'index.html')
const indexPresentationHtmlPath = path.resolve(__dirname, relativePath, 'index-presentation.html')
const faviconPath = path.resolve(__dirname, relativePath, 'favicon.png')
const buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

// creating i18nJson empty file for i18n
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath)
}
fs.writeFileSync(buildPath + '/i18nJson.js', 'var i18nJson = {}')

const buildConfig = (factory) => {

  const {
    entry,
    output,
    babel,
    plugins,
    devtool,
  } = factory({
    srcPath,
    modulesPath,
    indexHtmlPath,
    indexPresentationHtmlPath,
    faviconPath,
    buildPath,
  })

  return {
    devtool: devtool || 'source-map',
    entry,
    output,
    plugins,
    resolve: {
      modules: [
        srcPath,
        'node_modules',
      ],
      extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
      alias: {
        '@': path.join(__dirname, '..', 'src'),
      },
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx)$/,
          include: [
            srcPath,
            packagesPath,
          ],
          loader: 'babel-loader',
          query: babel,
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
                  require('postcss-modules-values'),
                ],
              },
            },
            { loader: 'sass-loader', options: { sourceMap: true, outputStyle: 'expanded' } },
          ],
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
                  require('postcss-modules-values'),
                ],
              },
            },
          ],
        },
        {
          test: /(?!node_modules\/chronobank-smart-contracts\/build\/contracts\/).+\.json$/, // all JSON files except contracts
          loader: 'json-loader',
          exclude: [
            path.resolve('node_modules/chronobank-smart-contracts/build/contracts'),
          ],
        },
        {
          test: /node_modules\/chronobank-smart-contracts\/build\/contracts\/.+\.json$/, // only ABI contracts
          loader: path.resolve('./config/abi-loader'),
          include: [
            path.resolve('node_modules/chronobank-smart-contracts/build/contracts'),
          ],
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file-loader',
        },
        { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
        { test: /\.otf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'application/font-woff' } } ] },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'octet-stream' } } ] },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [ { loader: 'url-loader', options: { limit: '10000', mimetype: 'image/svg+xml' } } ] },
      ],
    },
  }
}

module.exports = {
  buildConfig,
}

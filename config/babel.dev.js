/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const resolver = (module) =>
  (typeof module === 'string')
    ? require.resolve(module)
    : [require.resolve(module[0]), module[1]]

module.exports = {
  cacheDirectory: true,
  presets: [
    'babel-preset-react',
    'babel-preset-env',
    'babel-preset-react-hmre',
    'babel-preset-stage-0',
  ].map(resolver),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-syntax-decorators',
    'babel-plugin-syntax-trailing-function-commas',
    'babel-plugin-transform-runtime',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-transform-react-constant-elements',
    'babel-plugin-transform-class-properties',
    ['babel-plugin-react-css-modules', {
      "generateScopedName": "[name]__[local]___[hash:base64:5]",
      "filetypes": {
        ".scss": "postcss-scss",
      },
    }],
    'react-hot-loader/babel',
  ].map(resolver),
}

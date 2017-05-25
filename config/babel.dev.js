module.exports = {
  cacheDirectory: true,
  presets: [
    'babel-preset-react',
    'babel-preset-env',
    'babel-preset-react-hmre',
    'babel-preset-stage-0'
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-syntax-decorators',
    'babel-plugin-add-module-exports',
    'babel-plugin-syntax-trailing-function-commas',
    'babel-plugin-transform-runtime',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-transform-react-constant-elements',
    'babel-plugin-transform-class-properties',
    'react-hot-loader/babel'
  ].map(require.resolve)
}

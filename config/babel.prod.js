module.exports = {
    presets: [
        'babel-preset-es2015',
        'babel-preset-es2016',
        'babel-preset-react',
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
        'transform-decorators-legacy'
    ].map(require.resolve)
};

module.exports = {
  presets: [
    [
      'env',
      {
        modules: false,
      },
    ],
    'react',
  ],
  plugins: [
    'transform-class-properties',
    'transform-es2015-modules-commonjs',
  ],
}

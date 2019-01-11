/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

module.exports = {
  presets: [
    [
      'env',
      {
        modules: false
      }
    ],
    'react'
  ],
  plugins: [
    'transform-class-properties',
    'transform-es2015-modules-commonjs'
  ]
};

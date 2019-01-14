/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

module.exports = {
  rootDir: '../..',
  testURL: 'http://localhost',
  setupFiles: [
    '<rootDir>/config/jest/setup.js'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': '<rootDir>/config/jest/transform.js'
  },
  moduleDirectories: [
    'node_modules',
    'src'
  ]
};

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

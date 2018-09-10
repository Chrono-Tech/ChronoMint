module.exports = {
  rootDir: '../..',
  testURL: 'http://localhost',
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    '!**/*.{spec.js,mock.js}**'
  ],
  coverageReporters: [
    'lcov'
  ],
  setupFiles: [
    '<rootDir>/config/jest/setup.js'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': '<rootDir>/config/jest/transform.js'
  },
  testPathIgnorePatterns: [
    'config/babel.test.js'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleNameMapper: {
    '^@chronobank(.*)$': '<rootDir>/packages/$1',
    '\\.(css|scss)$': '<rootDir>/mocks/styleMock.js',
    '\\.(png|jpg|jpeg|gif|ttf|eot|woff|otf|svg)$': '<rootDir>/mocks/fileMock.js'
  }
};

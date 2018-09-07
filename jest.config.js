module.exports = {
  testURL: 'http://localhost',
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    '!**/*.{spec.js,mock.js}**'
  ],
  coverageReporters: [
    'lcov'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
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

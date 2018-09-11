const config = require('./config.base');

config.collectCoverageFrom = [
  'src/**/*.js',
  'src/**/*.jsx',
  '!**/*.{spec.js,mock.js,test.js}**'
];

config.coverageReporters = [
  'lcov'
];

config.moduleNameMapper = {
  '^@chronobank(.*)$': '<rootDir>/packages/$1',
  '\\.(css|scss)$': '<rootDir>/mocks/styleMock.js',
  '\\.(png|jpg|jpeg|gif|ttf|eot|woff|otf|svg)$': '<rootDir>/mocks/fileMock.js'
};

config.testRegex = '.*\\.(spec)\\.js$';

module.exports = config;

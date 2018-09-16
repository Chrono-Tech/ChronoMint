const config = require('./config.base');

config.globals = require('./e2e-global-vars');
config.verbose = true;

config.setupFiles.push('<rootDir>/config/jest/setup-e2e.js');
config.setupTestFrameworkScriptFile = 'expect-puppeteer';

config.testRegex = '.*\\.test\\.js$';
config.testPathIgnorePatterns = [
  'config/babel.test.js'
];

module.exports = config;

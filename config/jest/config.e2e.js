const config = require('./config.base');

config.globals = require('./e2e-global-vars');
config.verbose = true;
config.setupTestFrameworkScriptFile = '<rootDir>/config/jest/setup-e2e.js';

config.testRegex = '.*\\.test\\.js$';
config.testPathIgnorePatterns = [
  'config/babel.test.js'
];

module.exports = config;

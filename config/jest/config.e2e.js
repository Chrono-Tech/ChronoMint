const config = require('./config.base');
config.verbose = true;

config.testRegex = '.*\\.(test)\\.js$';
config.testPathIgnorePatterns = [
  'config/babel.test.js'
];

module.exports = config;

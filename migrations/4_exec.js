var exec = require('../node_modules/sync-exec');
module.exports = function(deployer) {
console.log(exec('truffle exec ./setup/4_setup_assets.js'))
}

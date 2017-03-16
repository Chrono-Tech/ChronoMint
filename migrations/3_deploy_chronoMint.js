var ChronoMint = artifacts.require("./ChronoMint.sol");
var ContractsManager = artifacts.require("./ContractsManager.sol");
var Shareable = artifacts.require("./PendingManager.sol");
var UserStorage = artifacts.require("./UserStorage.sol");
var UserManager = artifacts.require("./UserManager.sol");
module.exports = function(deployer, network) {
  return deployer.deploy(UserStorage).then(function () {
  return deployer.deploy(UserManager).then(function () {
     return deployer.deploy(Shareable).then(function () {
        return deployer.deploy(ChronoMint).then(function () {
                                        return deployer.deploy(ContractsManager).then(function () {
                                           return UserStorage.deployed().then(function (instance) {
                                              instance.addOwner(UserManager.address);
                                              return ChronoMint.deployed().then(function (instance) {
                                                 instance.init(UserStorage.address, Shareable.address);
                                                 return ContractsManager.deployed().then(function (instance) {
                                                 instance.init(UserStorage.address, Shareable.address);
                                                 return Shareable.deployed().then(function (instance) {
                                                 instance.init(UserStorage.address);
						 return UserManager.deployed().then(function (instance) {
                                                 instance.init(UserStorage.address, Shareable.address);
                                              });
                                              });
                                              });
                                            });
                                         });
                                        });
 				      });
                                    });
                                   });
				   });
}

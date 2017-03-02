var ChronoMint = artifacts.require("./ChronoMint.sol");
var EternalStorage = artifacts.require("./EternalStorage.sol");
module.exports = function(deployer, network) {
  return deployer.deploy(EternalStorage).then(function () {
                                        return deployer.deploy(ChronoMint, EternalStorage.address).then(function () {
                                            });
                                    });
}

const truffleConfig = require('../truffle.js')
const Web3 = require('../node_modules/web3')
const web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;
const web3 = new Web3(new Web3.providers.HttpProvider(web3Location));
module.exports = function(deployer) {
    return deployer.deploy(EventsHistory).then(function () {
        return deployer.deploy(ChronoBankPlatform).then(function () {
            return deployer.deploy(ChronoBankAsset).then(function () {
                return deployer.deploy(ChronoBankAssetWithFee).then(function () {
                    return deployer.deploy(ChronoBankAssetProxy).then(function () {
                        return deployer.deploy(ChronoBankAssetWithFeeProxy).then(function () {
                            return deployer.deploy(Rewards).then(function () {
                                return deployer.deploy(Exchange).then(function () {
                                        return deployer.deploy(ChronoMint, ChronoBankAsset.address, Rewards.address, Exchange.address, ChronoBankAssetProxy.address).then(function () {
                                            return deployer.deploy(LOC).then(function () {
                                                return deployer.deploy(ChronoBankPlatformEmitter);
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

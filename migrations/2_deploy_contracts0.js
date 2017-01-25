module.exports = function(deployer) {
    return deployer.deploy(EventsHistory).then(function () {
        return deployer.deploy(ChronoBankPlatform).then(function () {
            return deployer.deploy(ChronoBankAsset).then(function () {
                return deployer.deploy(ChronoBankAssetWithFee).then(function () {
                    return deployer.deploy(ChronoBankAssetProxy).then(function () {
                        return deployer.deploy(ChronoBankAssetWithFeeProxy).then(function () {
                            return deployer.deploy(Rewards).then(function () {
                                return deployer.deploy(Exchange).then(function () {
                                    return deployer.deploy(ChronoMint, ChronoBankAsset.address, ChronoBankAssetWithFee.address, ChronoBankPlatform.address, Rewards.address, Exchange.address, ChronoBankAssetProxy.address).then(function () {
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

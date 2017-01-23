module.exports = function(deployer) {
    return deployer.deploy(Stub).then(function () {
        return deployer.deploy(ChronoBankPlatformTestable).then(function () {
            return deployer.deploy(ChronoBankAsset).then(function () {
                return deployer.deploy(ChronoBankAssetWithFee).then(function () {
                    return deployer.deploy(ChronoBankAssetProxy).then(function () {
                        return deployer.deploy(Rewards).then(function () {
                            return deployer.deploy(Exchange).then(function () {
                                return deployer.deploy(ChronoMint, ChronoBankAsset.address, ChronoBankAssetWithFee.address, ChronoBankPlatformTestable.address, Rewards.address, Exchange.address, ChronoBankAssetProxy.address).then(function () {
                                    return deployer.deploy(LOC).then(function () {
                                        deployer.deploy(ChronoBankPlatformEmitter);
                                        deployer.deploy(EventsHistory);
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

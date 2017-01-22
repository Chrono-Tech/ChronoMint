module.exports = function(deployer) {
    return deployer.deploy(ChronoBankAsset).then(function() {
        return deployer.deploy(ChronoBankAssetProxy).then(function() {
            return deployer.deploy(Rewards).then(function() {
                return deployer.deploy(Exchange).then(function() {
                    return deployer.deploy(ChronoMint, ChronoBankAsset.address, Rewards.address, Exchange.address).then(function () {
                        return deployer.deploy(LOC);
                    });
                });
            });
        });
    });
};

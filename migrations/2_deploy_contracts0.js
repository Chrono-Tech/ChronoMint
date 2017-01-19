module.exports = function(deployer) {
    return deployer.deploy(TimeContract).then(function() {
        return deployer.deploy(RewardsContract).then(function() {
            return deployer.deploy(Exchange).then(function() {
                return deployer.deploy(ChronoMint, TimeContract.address, RewardsContract.address, Exchange.address).then(function() {
                    return deployer.deploy(LOC);
                });
            });
        });
    });
};
module.exports = function(deployer) {
  deployer.deploy(Stub);
  deployer.deploy(ChronoMint);
  deployer.deploy(TimeContract);
  deployer.deploy(RewardsContract);
};

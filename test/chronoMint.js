var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');

contract('ChronoMint', function(accounts) {
  var owner = accounts[0];
  var chronoMint;
  before('setup', function(done) {
    chronoMint = ChronoMint.deployed();
    tc = TimeContract.deployed();
    rc = RewardsContract.deployed();
    done();
  });

  it("should return the TIME contract address", function() {
      return chronoMint.setTimeContract(tc.address).then(function() {
        return chronoMint.timeContract.call(accounts[0])
      }).then(function(returnVal){
        assert.equal(returnVal, tc.address);
      });

  });
  it("should return the rewards contract address", function() {
      return chronoMint.setRewardsContract(rc.address).then(function() {
        return chronoMint.rewardsContract.call(accounts[0])
      }).then(function(returnVal){
        assert.equal(returnVal, rc.address);
      });

  });
});

// var Reverter = require('./helpers/reverter');
// var bytes32 = require('./helpers/bytes32');
contract('ChronoMint', function(accounts) {
  var owner = accounts[0];
var nonOwner = accounts[1];
var chronoMint;
before('setup', function(done) {
    chronoMint = ChronoMint.deployed();
    done();
  });
  it("should show owner as an authorized key.", function() {
      return chronoMint.isAuthorized(owner).then(function(r) {
        assert.isOk(r);
      });
  });
  it("should allow an authorized key to set the TIME contract address", function() {
    return chronoMint.setTimeContract(0x09889eeec7aac794b49f370783623a421df3f177).then(function() {
        return chronoMint.timeContract.call().then(function(r){
          assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
        });
    });
  });
  // it("should allow an authorized key to set the rewards contract address", function() {
  //     return ChronoMint.deployed().setRewardsContract.call("0xf695231c801d669c305d016222ee17eed021691d").then(function() {
  //       assert.equal(ChronoMint.deployed().rewardsContract.call(), "0xf695231c801d669c305d016222ee17eed021691d");
  //     });
  // });
  // it("should not allow an unauthorized key to set the TIME contract address", function() {
  //     var nonOwner = accounts[1];
  //     return ChronoMint.deployed().setTimeContract("0xf695231c801d669c305d016222ee17eed021691d", {from: nonOwner}).then(function() {
  //       return ChronoMint.deployed().timeContract()
  //     }).then(function(returnVal){
  //       assert.equal(returnVal, TimeContract.deployed().address);
  //     });
  //
  // });
  // it("should not allow an unauthorized key to set the rewards contract address", function() {
  //   return ChronoMint.deployed().setRewardsContract("0xf695231c801d669c305d016222ee17eed021691d", {from: nonOwner}).then(function() {
  //     return ChronoMint.deployed().rewardsContract()
  //   }).then(function(returnVal){
  //     assert.equal(returnVal, RewardsContract.deployed().address);
  //   });
  // });
});

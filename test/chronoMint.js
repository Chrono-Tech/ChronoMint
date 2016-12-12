var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
contract('ChronoMint', function(accounts) {
  var owner = accounts[0];
  var owner1 = accounts[1];
  var owner2 = accounts[2];
  var owner3 = accounts[3];
  var owner4 = accounts[4];
  var owner5 = accounts[5];
  var nonOwner = accounts[6];

  var chronoMint;
  before('setup', function(done) {
      chronoMint = ChronoMint.deployed();
      done();
    });

  context("with one CBE key", function(){
    it("should show owner as an CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should not show owner1 as an CBE key.", function() {
      return chronoMint.isAuthorized.call(owner1).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("should allow an CBE key to set the TIME contract address", function() {
      return chronoMint.setTimeContract("0x09889eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddressSetting.call('timeContract').then(function(r){
            assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should allow an CBE key to set the rewards contract address", function() {
      return chronoMint.setRewardsContract("0x09789eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
            assert.equal(r, '0x09789eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should not allow an non CBE key to set the TIME contract address", function() {
        return chronoMint.setTimeContract("0xf695231c801d669c305d016222ee17eed021691d", {from: nonOwner}).then(function() {
          return chronoMint.timeContract()
        }).then(function(returnVal){
          assert.notEqual(returnVal, "0xf695231c801d669c305d016222ee17eed021691d");
        });
    });

    it("should not allow an non CBE key to set the rewards contract address", function() {
      return chronoMint.setRewardsContract("0xf695231c801d669c305d016222ee17eed021691d", {from: nonOwner}).then(function() {
        return chronoMint.rewardsContract()
      }).then(function(returnVal){
        assert.notEqual(returnVal, "0xf695231c801d669c305d016222ee17eed021691d");
      });
    });

    it("should allow one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner1).then(function() {
          return chronoMint.isAuthorized.call(owner1).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with two CBE keys", function(){
    it("should show owner as an CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should show owner1 as an CBE key.", function() {
        return chronoMint.isAuthorized.call(owner1).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should not show owner2 as an CBE key.", function() {
      return chronoMint.isAuthorized.call(owner2).then(function(r) {
        assert.isNotOk(r);
      });
    });
    
    it("should allow one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner2).then(function() {
          return chronoMint.isAuthorized.call(owner2).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with three CBE keys", function(){
    it("should collect first call to addKey as a vote for that key instead of granting auth.", function() {
      return chronoMint.addKey(owner3).then(function() {
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("should allow second vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner3, {from: owner1}).then(function() {
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with four CBE keys", function(){
    it("should collect first call to addKey as a vote for that key instead of granting auth.", function() {
      return chronoMint.addKey(owner4).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("should allow second vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner4, {from: owner1}).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with five CBE keys", function(){
    it("should collect first two calls to addKey as a vote for that key instead of granting auth.", function() {
      return chronoMint.addKey(owner5).then(function() {
        return chronoMint.isAuthorized.call(owner5).then(function(r){
          assert.isNotOk(r);
          return chronoMint.addKey(owner5, {from: owner1}).then(function(r){
            return chronoMint.isAuthorized.call(owner5).then(function(r){
              assert.isNotOk(r);
            });
          });
        });
      });
    });

    it("should not allow non CBE key to vote for itself.", function() {
      return chronoMint.addKey(owner5, {from: owner5}).then(function() {
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("should allow a third vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner5, {from: owner2}).then(function() {
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isOk(r);
          });
      });
    });

    it("should collect first two calls to revoke as a vote for that key to be removed.", function() {
      return chronoMint.revokeKey(owner4, {from: owner}).then(function() {
        return chronoMint.isAuthorized.call(owner4).then(function(r){
          assert.isOk(r);
          return chronoMint.revokeKey(owner4, {from: owner1}).then(function(r){
            return chronoMint.isAuthorized.call(owner4).then(function(r){
              assert.isOk(r);
            });
          });
        });
      });
    });

    it("should allow a third vote against the key to revoke auth.", function() {
      return chronoMint.revokeKey(owner4, {from: owner2}).then(function() {
        return chronoMint.isAuthorized.call(owner4).then(function(r){
          assert.isNotOk(r);
        });
      });
    });
  });
});

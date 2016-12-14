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
    it("should show owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should not show owner1 as a CBE key.", function() {
      return chronoMint.isAuthorized.call(owner1).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("should allow a CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress("timeContract","0x09889eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddressSetting.call('timeContract').then(function(r){
            assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should allow a CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress("rewardsContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function() {
          return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
            assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("should allow a CBE key to set the securityPercentage", function() {
      return chronoMint.setUint("securityPercentage","5").then(function() {
          return chronoMint.getUintSetting.call('securityPercentage').then(function(r){
            assert.equal(r, '5');
          });
      });
    });

    it("should not allow a non CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress("timeContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b", {from: nonOwner}).then(function() {
          return chronoMint.getAddressSetting.call('timeContract').then(function(r){
            assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("should not allow a non CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress("rewardsContract","0xf695231c801d669c305d016222ee17eed021691d", {from: nonOwner}).then(function() {
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
    it("should show owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should show owner1 as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner1).then(function(r) {
          assert.isOk(r);
        });
    });

    it("should not show owner2 as a CBE key.", function() {
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

    it("should collect first two calls to setAddress as votes for a new address", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from:owner1}).then(function() {
                return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
                  assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                });
            });
          });
      });
    });

    it("should allow owner1 to change his address vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789444c7aac794b49f370783623a421df3f177", {from:owner1}).then(function() {
          return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            assert.notEqual(r, '0x19789444c7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should not count the third vote as the final vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner2}).then(function() {
        return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
          assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("should allow a fourth vote to setAddress to set new address.", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner3}).then(function() {
        return chronoMint.getAddressSetting.call('rewardsContract').then(function(r){
          assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("should collect first two calls to setUint as votes for a new value ", function() {
      return chronoMint.setUint("securityPercentage","22").then(function() {
          return chronoMint.getUintSetting.call('securityPercentage').then(function(r){
            assert.notEqual(r, '22');
            return chronoMint.setUint("securityPercentage","22", {from: owner1}).then(function() {
                return chronoMint.getUintSetting.call('securityPercentage').then(function(r){
                  assert.notEqual(r, '22');
                });
            });
          });
      });
    });

    it("should allow owner1 to change his uint vote", function() {
      return chronoMint.setUint("securityPercentage","32", {from:owner1}).then(function() {
          return chronoMint.getUintSetting.call('rewardsContract').then(function(r){
            assert.notEqual(r, '32');
            assert.notEqual(r, '22');
          });
      });
    });

    it("should not count the third vote as the final vote.", function() {
      return chronoMint.setUint("securityPercentage","22", {from:owner3}).then(function() {
        return chronoMint.getUintSetting.call('securityPercentage').then(function(r){
          assert.notEqual(r, '22');
        });
      });
    });

    it("should allow a fourth vote to setUint to set new value.", function() {
      return chronoMint.setUint("securityPercentage","22", {from:owner4}).then(function() {
        return chronoMint.getUintSetting.call('securityPercentage').then(function(r){
          assert.equal(r, '22');
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

    it("should allow a third vote for the revocation to revoke authorization.", function() {
      return chronoMint.revokeKey(owner4, {from: owner2}).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isNotOk(r);
          });
      });
    });
  });
});

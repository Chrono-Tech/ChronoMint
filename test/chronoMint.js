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
  var locController1 = accounts[7];
  var chronoMint;
  var loc_contracts = [];
  var LOCStatus = {proposed:0,active:1, suspended:2, bankrupt:3};

  before('setup', function(done) {
      chronoMint = ChronoMint.deployed();
//       pry = require('pryjs')
// eval(pry.it)
      // var event = chronoMint.Vote(function(args, result){
      //   if(args)
      //     console.log(args.newContract);
      //   });
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
          return chronoMint.getAddress.call('timeContract').then(function(r){
            assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should allow a CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress("rewardsContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function() {
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("should allow a CBE key to set the securityPercentage", function() {
      return chronoMint.setUint("securityPercentage","5").then(function() {
          return chronoMint.getUint.call('securityPercentage').then(function(r){
            assert.equal(r, '5');
          });
      });
    });

    it("should not allow a non CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress("timeContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call('timeContract').then(function(r){
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
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from:owner1}).then(function() {
                return chronoMint.getAddress.call('rewardsContract').then(function(r){
                  assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                });
            });
          });
      });
    });

    it("should allow owner1 to change his address vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789444c7aac794b49f370783623a421df3f177", {from:owner1}).then(function() {
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            assert.notEqual(r, '0x19789444c7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("should not count the third vote as the final vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner2}).then(function() {
        return chronoMint.getAddress.call('rewardsContract').then(function(r){
          assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("should allow a fourth vote to setAddress to set new address.", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner3}).then(function() {
        return chronoMint.getAddress.call('rewardsContract').then(function(r){
          assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("should collect first two calls to setUint as votes for a new value ", function() {
      return chronoMint.setUint("securityPercentage","22").then(function() {
          return chronoMint.getUint.call('securityPercentage').then(function(r){
            assert.notEqual(r, '22');
            return chronoMint.setUint("securityPercentage","22", {from: owner1}).then(function() {
                return chronoMint.getUint.call('securityPercentage').then(function(r){
                  assert.notEqual(r, '22');
                });
            });
          });
      });
    });

    it("should allow owner1 to change his uint vote", function() {
      return chronoMint.setUint("securityPercentage","32", {from:owner1}).then(function() {
          return chronoMint.getUint.call('rewardsContract').then(function(r){
            assert.notEqual(r, '32');
            assert.notEqual(r, '22');
          });
      });
    });

    it("should not count the third vote as the final vote.", function() {
      return chronoMint.setUint("securityPercentage","22", {from:owner3}).then(function() {
        return chronoMint.getUint.call('securityPercentage').then(function(r){
          assert.notEqual(r, '22');
        });
      });
    });

    it("should allow a fourth vote to setUint to set new value.", function() {
      return chronoMint.setUint("securityPercentage","22", {from:owner4}).then(function() {
        return chronoMint.getUint.call('securityPercentage').then(function(r){
          assert.equal(r, '22');
        });
      });
    });

    it("should allow a CBE to Propose an LOC.", function() {
      return chronoMint.proposeLOC("Bob's Hard Workers","http://chronobank.io", locController1, 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB").then(function() {
        return chronoMint.getLOC.call('0').then(function(r){
          loc_contracts.push(LOC.at(r));
            return loc_contracts[0].approverCount.call().then(function(r){
              assert.equal(r, "1");
          });
        });
      });
    });

    it("should allow another CBE to vote to approve an LOC.", function() {
      return chronoMint.approveLOC(loc_contracts[0].address, {from: owner1}).then(function() {
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, LOCStatus.proposed);
            return loc_contracts[0].approverCount.call().then(function(r){
              assert.equal(r, "2");
          });
        });
      });
    });
    it("should allow a third CBE approval to activate an LOC.", function() {
      return chronoMint.approveLOC(loc_contracts[0].address, {from: owner2}).then(function() {
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, LOCStatus.active);
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

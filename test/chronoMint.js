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
  var labor_hour_token_contracts = [];
  var Status = {maintenance:0,active:1, suspended:2, bankrupt:3};

  before('setup', function(done) {
      chronoMint = ChronoMint.deployed();
      done();

    });

  context("with one CBE key", function(){
    it("shows owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("doesn't show owner1 as a CBE key.", function() {
      return chronoMint.isAuthorized.call(owner1).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("allows a CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress("timeContract","0x09889eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddress.call('timeContract').then(function(r){
            assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("allows a CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress("rewardsContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function() {
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("allows a CBE key to set the securityPercentage", function() {
      return chronoMint.setValue("securityPercentage","5").then(function() {
          return chronoMint.getValue.call('securityPercentage').then(function(r){
            assert.equal(r, '5');
          });
      });
    });

    it("doesn't allow a non CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress("timeContract","0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call('timeContract').then(function(r){
            assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("doesn't allow a non CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress("rewardsContract","0x473293cbebb8b24e4bf14d79b8ebd7e65a8c703b", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x473293cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    })

    it("allows one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner1).then(function() {
          return chronoMint.isAuthorized.call(owner1).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with two CBE keys", function(){
    it("shows owner as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner).then(function(r) {
          assert.isOk(r);
        });
    });

    it("shows owner1 as a CBE key.", function() {
        return chronoMint.isAuthorized.call(owner1).then(function(r) {
          assert.isOk(r);
        });
    });

    it("doesn't show owner2 as a CBE key.", function() {
      return chronoMint.isAuthorized.call(owner2).then(function(r) {
        assert.isNotOk(r);
      });
    });

    it("allows one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner2).then(function() {
          return chronoMint.isAuthorized.call(owner2).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with three CBE keys", function(){
    it("collects first call to addKey as a vote for that key instead of granting auth.", function() {
      return chronoMint.addKey(owner3).then(function() {
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("allows second vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner3, {from: owner1}).then(function() {
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with four CBE keys", function(){
    it("collects first call to addKey as a vote for that key instead of granting auth.", function() {
      return chronoMint.addKey(owner4).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("allows second vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner4, {from: owner1}).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isOk(r);
          });
      });
    });
  });

  context("with five CBE keys", function(){
    it("collects first two calls to addKey as a vote for that key instead of granting auth.", function() {
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

    it("doesn't allow non CBE key to vote for itself.", function() {
      return chronoMint.addKey(owner5, {from: owner5}).then(function() {
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

    it("allows a third vote for the new key to grant authorization.", function() {
      return chronoMint.addKey(owner5, {from: owner2}).then(function() {
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isOk(r);
          });
      });
    });

    it("collects first two calls to setAddress as votes for a new address", function() {
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

    it("allows owner1 to change his address vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789444c7aac794b49f370783623a421df3f177", {from:owner1}).then(function() {
          return chronoMint.getAddress.call('rewardsContract').then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            assert.notEqual(r, '0x19789444c7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("doesn't count the third vote as the final vote", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner2}).then(function() {
        return chronoMint.getAddress.call('rewardsContract').then(function(r){
          assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("allows a fourth vote to setAddress to set new address.", function() {
      return chronoMint.setAddress("rewardsContract","0x19789eeec7aac794b49f370783623a421df3f177", {from: owner3}).then(function() {
        return chronoMint.getAddress.call('rewardsContract').then(function(r){
          assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("collects first two calls to setValue as votes for a new value ", function() {
      return chronoMint.setValue("securityPercentage","22").then(function() {
          return chronoMint.getValue.call('securityPercentage').then(function(r){
            assert.notEqual(r, '22');
            return chronoMint.setValue("securityPercentage","22", {from: owner1}).then(function() {
                return chronoMint.getValue.call('securityPercentage').then(function(r){
                  assert.notEqual(r, '22');
                });
            });
          });
      });
    });

    it("allows owner1 to change his uint vote", function() {
      return chronoMint.setValue("securityPercentage","32", {from:owner1}).then(function() {
          return chronoMint.getValue.call('rewardsContract').then(function(r){
            assert.notEqual(r, '32');
            assert.notEqual(r, '22');
          });
      });
    });

    it("doesn't count the third vote as the final vote.", function() {
      return chronoMint.setValue("securityPercentage","22", {from:owner3}).then(function() {
        return chronoMint.getValue.call('securityPercentage').then(function(r){
          assert.notEqual(r, '22');
        });
      });
    });

    it("allows a fourth vote to setValue to set new value.", function() {
      return chronoMint.setValue("securityPercentage","22", {from:owner4}).then(function() {
        return chronoMint.getValue.call('securityPercentage').then(function(r){
          assert.equal(r, '22');
        });
      });
    });

    it("allows a CBE to propose an LOC.", function() {
      return LOC.new("Bob's Hard Workers",chronoMint.address, locController1, 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB").then(function(r) {
        loc_contracts[0] = r;
        return chronoMint.proposeLOC(loc_contracts[0].address).then(function(r){
            return loc_contracts[0].status.call().then(function(r){
              assert.equal(r, Status.maintenance);
          });
        });
      });
    });

    it("allows another CBE to vote to approve LOC without LOC status changing", function() {
      return chronoMint.approveContract(loc_contracts[0].address, {from: owner1}).then(function() {
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.maintenance);
        });
      });
    });

    it("allows a third CBE approval to activate an LOC.", function() {
      return chronoMint.approveContract(loc_contracts[0].address, {from: owner2}).then(function() {
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.active);
        });
      });
    });

    it("allows a CBE to propose an LaborHourToken.", function() {
      return LaborHourToken.new(chronoMint.address,"USD", 1).then(function(r) {
        labor_hour_token_contracts[0] = r;
        return chronoMint.proposeLaborHourToken(labor_hour_token_contracts[0].address).then(function(r){
            return labor_hour_token_contracts[0].status.call().then(function(r){
              assert.equal(r, Status.maintenance);
          });
        });
      });
    });

    it("allows another CBE to vote to approve LaborHourToken without LaborHourToken status changing", function() {
      return chronoMint.approveContract(labor_hour_token_contracts[0].address, {from: owner1}).then(function() {
        return labor_hour_token_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.maintenance);
        });
      });
    });


    it("allows a third CBE approval to activate an LaborHourToken.", function() {
      return chronoMint.approveContract(labor_hour_token_contracts[0].address, {from: owner2}).then(function() {
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.active);
        });
      });
    });

    it("allows a CBE to propose a settings change for the contract.", function() {
      return chronoMint.setContractValue(loc_contracts[0].address, "issueLimit", 2000).then(function() {
        return loc_contracts[0].getVal.call("issueLimit").then(function(r){
          assert.equal(r, '1000');
        });
      });
    });
    it("allows another CBE to support the proposed settings change for the contract.", function() {
      return chronoMint.setContractValue(loc_contracts[0].address, "issueLimit", 2000, {from: owner1}).then(function() {
        return loc_contracts[0].getVal.call("issueLimit").then(function(r){
          assert.equal(r, '1000');
        });
      });
    });

    it("allows a third CBE approval to commit the proposed settings change to the subject contract.", function() {
      return chronoMint.setContractValue(loc_contracts[0].address, "issueLimit", 2000, {from: owner2}).then(function() {
        return loc_contracts[0].getVal.call("issueLimit").then(function(r){
          assert.equal(r, '2000');
        });
      });
    });

    it("allows a CBE to propose revocation of an authorized key.", function() {
      return chronoMint.revokeKey(owner4, {from: owner}).then(function() {
        return chronoMint.isAuthorized.call(owner4).then(function(r){
          assert.isOk(r);
        });
      });
    });

    it("collects first two calls to revoke as a vote for that key to be removed.", function() {
      return chronoMint.revokeKey(owner4, {from: owner1}).then(function(r){
        return chronoMint.isAuthorized.call(owner4).then(function(r){
          assert.isOk(r);
        });
      });
    });

    it("allows a third vote for the revocation to revoke authorization.", function() {
      return chronoMint.revokeKey(owner4, {from: owner2}).then(function() {
          return chronoMint.isAuthorized.call(owner4).then(function(r){
            assert.isNotOk(r);
          });
      });
    });
  });
});

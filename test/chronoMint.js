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
  var locController2 = accounts[7];
  var chronoMint;
  var conf_sign;
  var conf_sign2;
  var loc_contracts = [];
  var labor_hour_token_contracts = [];
  var Status = {maintenance:0,active:1, suspended:2, bankrupt:3};

  before('setup', function(done) {
      chronoMint = ChronoMint.deployed();
      ChronoMint.next_gen = true;
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
      return chronoMint.setAddress(9,"0x09889eeec7aac794b49f370783623a421df3f177").then(function() {
          return chronoMint.getAddress.call(9).then(function(r){
            assert.equal(r, '0x09889eeec7aac794b49f370783623a421df3f177');
          });
      });
    });

    it("allows a CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress(10,"0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function() {
          return chronoMint.getAddress.call(10).then(function(r){
            assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
          });
      });
    });

    it("doesn't allow a non CBE key to set the TIME contract address", function() {
      return chronoMint.setAddress(9,"0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call(9).then(function(r){
            assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a');
          });
      });
    });

    it("doesn't allow a non CBE key to set the rewards contract address", function() {
      return chronoMint.setAddress(10,"0x473293cbebb8b24e4bf14d79b8ebd7e65a8c703a", {from: nonOwner}).then(function() {
          return chronoMint.getAddress.call(10).then(function(r){
            assert.notEqual(r, '0x473293cbebb8b24e4bf14d79b8ebd7e65a8c703a');
          });
      });
    })

    it("allows one CBE key to add another CBE key.", function() {
      return chronoMint.addKey(owner1).then(function(r) {
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
      return chronoMint.addKey(owner2, {from:owner}).then(function(r) {
       return chronoMint.confirm(r.logs[0].args.operation,{from:owner1}).then(function(r) {
          return chronoMint.isAuthorized.call(owner2).then(function(r){
            assert.isOk(r);
          });
       });
      });
    });
  });

  context("with three CBE keys", function(){

    it("allows second vote for the new key to grant authorization.", function() {
     return chronoMint.setRequired(3).then(function(r) {
      return chronoMint.addKey(owner3, {from: owner2}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
     });
    });

  });

  context("with four CBE keys", function(){

  it("allows second vote for the new key to grant authorization.", function() {
     return chronoMint.setRequired(4).then(function(r) {
      return chronoMint.addKey(owner4, {from: owner3}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
          return chronoMint.isAuthorized.call(owner3).then(function(r){
            assert.isOk(r);
          });
      });
     });
    });

  });

  context("with five CBE keys", function(){
    it("collects 4 vote to addKey and granting auth.", function() {
    return chronoMint.setRequired(5).then(function(r) {
      return chronoMint.addKey(owner5, {from: owner4}).then(function(r) {
          chronoMint.confirm(r.logs[0].args.operation,{from:owner});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
          chronoMint.confirm(r.logs[0].args.operation,{from:owner3});
            return chronoMint.isAuthorized.call(owner5).then(function(r){
              assert.isOk(r);
            });
        });
      });
    });

    it("collects 1 call and 1 vote for setAddress as 2 votes for a new address", function() {
      return chronoMint.setAddress(9,"0x19789eeec7aac794b49f370783623a421df3f177",{from:owner}).then(function(r) {
          conf_sign = r.logs[0].args.operation;
          return chronoMint.getAddress.call(9).then(function(r){
            assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
            return chronoMint.confirm(conf_sign, {from:owner1}).then(function() {
                return chronoMint.getAddress.call(9).then(function(r){
                  assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                });
            });
          });
      });
    });
  
  it("check confirmation yet needed should be 3", function() {
      return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
      assert.equal(r,3);
   });
  });

  it("check owner1 hasConfirmed new addrees", function() {
    return chronoMint.hasConfirmed.call(conf_sign, owner1).then(function(r) {
     assert.isOk(r);
   });      
  });

  it("revoke owner1 and check not hasConfirmed new addrees", function() {
    return chronoMint.revoke(conf_sign,{from:owner1}).then(function() {
      return chronoMint.hasConfirmed.call(conf_sign, owner1).then(function(r) {
         assert.isNotOk(r);
      });
    });
  });

  it("check confirmation yet needed should be 4", function() {
      return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
      assert.equal(r,4);
   });
  });

    it("allows owner1 and 3 more votes to set new address.", function() {
      return chronoMint.confirm(conf_sign, {from: owner1}).then(function() {
        chronoMint.confirm(conf_sign, {from: owner2});
        chronoMint.confirm(conf_sign, {from: owner3});
        chronoMint.confirm(conf_sign, {from: owner4});
        return chronoMint.getAddress.call(9).then(function(r){
          assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
        });
      });
    });

    it("allows a CBE to propose an LOC.", function() {
            return chronoMint.proposeLOC("Bob's Hard Workers", "www.ru", 1000, "QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB",1484554656).then(function(r){
                loc_contracts[0] = LOC.at(r.logs[0].args._LOC);
                return loc_contracts[0].status.call().then(function(r){
                   assert.equal(r, Status.maintenance);
                });
        });
    });

    it("allows 5 CBE members to activate an LOC.", function() {
      return chronoMint.setLOCStatus(loc_contracts[0].address, Status.active, {from: owner}).then(function(r) {
        chronoMint.confirm(r.logs[0].args.operation,{from:owner1});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner2});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner3});
        chronoMint.confirm(r.logs[0].args.operation,{from:owner4}); 
        return loc_contracts[0].status.call().then(function(r){
          assert.equal(r, Status.active);
        });
      });
    });

    it("collects call to setValue and first vote for a new value ", function() {
      return chronoMint.setLOCValue(loc_contracts[0].address,13,22).then(function(r) {
          conf_sign = r.logs[0].args.operation;
          return loc_contracts[0].getValue.call(13).then(function(r){
            assert.notEqual(r, 22);
            return chronoMint.confirm(conf_sign, {from: owner1}).then(function() {
                return loc_contracts[0].getValue.call(13).then(function(r){
                  assert.notEqual(r, 22);
                });
            });
          });
      });
    });
   
   it("check operation type is editLOC", function() {
      return chronoMint.getTxsType.call(conf_sign).then(function(r) {
         assert.equal(r,1);
   });
   });

   it("should increment pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 1);
            });
    });

    it("allows a CBE to propose revocation of an authorized key.", function() {
      return chronoMint.revokeKey(owner5, {from:owner}).then(function(r) {
        conf_sign2 = r.logs[0].args.operation;
        return chronoMint.isAuthorized.call(owner5).then(function(r){
          assert.isOk(r);
        });
      });
    });

   it("should increment pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 2);
            });
    });

    it("allows a 3 more votes to set new value.", function() {
      return chronoMint.confirm(conf_sign, {from: owner2}).then(function() {
        chronoMint.confirm(conf_sign, {from: owner3});
        chronoMint.confirm(conf_sign, {from: owner4});
        return loc_contracts[0].getValue.call(13).then(function(r){
          assert.equal(r, 22);
        });
      });
    });

   it("should decrement pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 1);
            });
    });

    it("doesn't allow non CBE to change settings for the contract.", function() {
      return loc_contracts[0].setValue(4, 2000).then(function() {
        return loc_contracts[0].getValue.call(4).then(function(r){
          assert.equal(r, '1000');
        });
      });
    });

    it("allows CBE controller to change the name of the LOC", function() {
      return chronoMint.setLOCString(loc_contracts[0].address,0,"Tom's Hard Workers").then(function() {
        return loc_contracts[0].getName.call().then(function(r){
          assert.equal(r, "Tom's Hard Workers");
        });
      });
    });

    it("allows 4 CBE member vote for the revocation to revoke authorization.", function() {
      return chronoMint.confirm(conf_sign2,{from:owner}).then(function(r) {
	chronoMint.confirm(conf_sign2,{from:owner1});
        chronoMint.confirm(conf_sign2,{from:owner2});
        chronoMint.confirm(conf_sign2,{from:owner3});
        chronoMint.confirm(conf_sign2,{from:owner4});
          return chronoMint.isAuthorized.call(owner5).then(function(r){
            assert.isNotOk(r);
          });
      });
    });

   it("should decrement pending operation counter ", function() {
            return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
                  assert.equal(r, 0);
            });
    });
  });
});

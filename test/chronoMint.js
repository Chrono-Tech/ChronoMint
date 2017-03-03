var ChronoBankPlatform = artifacts.require("./ChronoBankPlatform.sol");
var ChronoBankPlatformEmitter = artifacts.require("./ChronoBankPlatformEmitter.sol");
var EventsHistory = artifacts.require("./EventsHistory.sol");
var ChronoBankAssetProxy = artifacts.require("./ChronoBankAssetProxy.sol");
var ChronoBankAssetWithFeeProxy = artifacts.require("./ChronoBankAssetWithFeeProxy.sol");
var ChronoBankAsset = artifacts.require("./ChronoBankAsset.sol");
var ChronoBankAssetWithFee = artifacts.require("./ChronoBankAssetWithFee.sol");
var Exchange = artifacts.require("./Exchange.sol");
var Rewards = artifacts.require("./Rewards.sol");
var ChronoMint = artifacts.require("./ChronoMint.sol");
var LOC = artifacts.require("./LOC.sol");
var EternalStorage = artifacts.require("./EternalStorage.sol");
var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
var Require = require("truffle-require");
var Config = require("truffle-config");
var exec = require('sync-exec');

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
    var conf_sign;
    var conf_sign2;
    var chronoMint;
    var rewardContract;
    var platform;
    var timeContract;
    var lhContract;
    var timeProxyContract;
    var lhProxyContract;
    var exchange;
    var rewards;
    var loc_contracts = [];
    var labor_hour_token_contracts = [];
    var Status = {maintenance:0,active:1, suspended:2, bankrupt:3};

    const SYMBOL = 'TIME';
    const SYMBOL2 = 'LHT';
    const NAME = 'Time Token';
    const DESCRIPTION = 'ChronoBank Time Shares';
    const NAME2 = 'Labour-hour Token';
    const DESCRIPTION2 = 'ChronoBank Lht Assets';
    const BASE_UNIT = 2;
    const IS_REISSUABLE = true;
    const IS_NOT_REISSUABLE = false;
    const BALANCE_ETH = 1000;
    const fakeArgs = [0,0,0,0,0,0,0,0];

    before('setup', function(done) {

    ChronoBankPlatform.deployed().then(function (instance) {
        platform = instance;
        return ChronoBankAsset.deployed()
    }).then(function (instance) {
        timeContract = instance;
        return ChronoBankAssetWithFee.deployed()
    }).then(function (instance) {
        lhContract = instance;
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        timeProxyContract = instance;
        return ChronoBankAssetWithFeeProxy.deployed()
    }).then(function(instance) {
        lhProxyContract = instance;
        return ChronoBankPlatform.deployed()
    }).then(function (instance) {
        chronoBankPlatform = instance;
        return ChronoMint.deployed()
    }).then(function (instance) {
        chronoMint = instance;
        return ChronoBankPlatformEmitter.deployed()
    }).then(function (instance) {
        chronoBankPlatformEmitter = instance;
        return EventsHistory.deployed()
    }).then(function (instance) {
        eventsHistory = instance;
        return chronoBankPlatform.setupEventsHistory(EventsHistory.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addEmitter(chronoBankPlatformEmitter.contract.emitError.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {
            from: accounts[0],
            gas: 3000000
        });
    }).then(function () {
        return eventsHistory.addVersion(chronoBankPlatform.address, "Origin", "Initial version.");
    }).then(function () {
        return chronoBankPlatform.issueAsset(SYMBOL, 10000, NAME, DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE, {
            from: accounts[0],
            gas: 3000000
        })
    }).then(function (r) {
        return chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, SYMBOL, {from: accounts[0]})
    }).then(function (r) {
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankPlatform.address, SYMBOL, NAME, {from: accounts[0]})
    }).then(function (r) {
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.proposeUpgrade(ChronoBankAsset.address, {from: accounts[0]})
    }).then(function (r) {
        return ChronoBankAsset.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankAssetProxy.address, {from: accounts[0]})
    }).then(function (r) {
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.transfer(ChronoMint.address, 10000, {from: accounts[0]})
    }).then(function (r) {
        return chronoBankPlatform.changeOwnership(SYMBOL, chronoMint.address, {from: accounts[0]})
    }).then(function (r) {
        return chronoBankPlatform.issueAsset(SYMBOL2, 0, NAME2, DESCRIPTION2, BASE_UNIT, IS_REISSUABLE, {
            from: accounts[0],
            gas: 3000000
        })
    }).then(function () {
        return chronoBankPlatform.setProxy(ChronoBankAssetWithFeeProxy.address, SYMBOL2, {from: accounts[0]})
    }).then(function () {
        return ChronoBankAssetWithFeeProxy.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankPlatform.address, SYMBOL2, NAME2, {from: accounts[0]})
    }).then(function () {
        return ChronoBankAssetWithFeeProxy.deployed()
    }).then(function (instance) {
        return instance.proposeUpgrade(ChronoBankAssetWithFee.address, {from: accounts[0]})
    }).then(function () {
        return ChronoBankAssetWithFee.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankAssetWithFeeProxy.address, {from: accounts[0]})
    }).then(function () {
        return ChronoBankPlatform.deployed()
    }).then(function (instance) {
        return instance.changeOwnership(SYMBOL2, ChronoMint.address, {from: accounts[0]})
    }).then(function () {
        return chronoBankPlatform.changeContractOwnership(ChronoMint.address, {from: accounts[0]})
    }).then(function () {
        return chronoMint.claimPlatformOwnership(ChronoBankPlatform.address, {from: accounts[0]})
    }).then(function () {
        return Exchange.deployed()
    }).then(function (instance) {
        exchange = instance;
        return exchange.init(ChronoBankAssetWithFeeProxy.address)
    }).then(function () {
        return exchange.changeContractOwnership(chronoMint.address, {from: accounts[0]})
    }).then(function () {
        return chronoMint.claimExchangeOwnership(exchange.address, {from: accounts[0]})
    }).then(function () {
        return Rewards.deployed()
    }).then(function (instance) {
        rewards = instance;
        return rewards.init(ChronoBankAssetProxy.address, 0)
    }).then(function () {
        return chronoMint.setOtherAddress(rewards.address, {from: accounts[0]})
    }).then(function () {
        return chronoMint.setAddress(ChronoBankAssetProxy.address, {from: accounts[0]})
    }).then(function () {
        return chronoMint.setAddress(ChronoBankAssetWithFeeProxy.address, {from: accounts[0]})
    }).then(function(instance) {
        web3.eth.sendTransaction({to: Exchange.address, value: BALANCE_ETH, from: accounts[0]});
        done();
    }).catch(function (e) { console.log(e); });
});




context("with one CBE key", function(){

    it("Platform has correct TIME proxy address.", function() {
        return platform.proxies.call(SYMBOL).then(function(r) {
            assert.equal(r,timeProxyContract.address);
        });
    });

    it("Platform has correct LHT proxy address.", function() {
        return platform.proxies.call(SYMBOL2).then(function(r) {
            assert.equal(r,lhProxyContract.address);
        });
    });


    it("TIME contract has correct TIME proxy address.", function() {
        return timeContract.proxy.call().then(function(r) {
            assert.equal(r,timeProxyContract.address);
        });
    });

    it("LHT contract has correct LHT proxy address.", function() {
        return lhContract.proxy.call().then(function(r) {
            assert.equal(r,lhProxyContract.address);
        });
    });

    it("TIME proxy has right version", function() {
        return timeProxyContract.getLatestVersion.call().then(function(r) {
            assert.equal(r,timeContract.address);
        });
    });

    it("LHT proxy has right version", function() {
        return lhProxyContract.getLatestVersion.call().then(function(r) {
            assert.equal(r,lhContract.address);
        });
    });

    it("can show all Asset contracts", function() {
        return chronoMint.getContracts.call().then(function(r) {
            console.log(r);
            assert.equal(r.length,2);
        });
    });

    it("can show all Service contracts", function() {
        return chronoMint.getOtherContracts.call().then(function(r) {
            console.log(r);
            assert.equal(r.length,2);
        });
    });

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

    it("can provide TimeProxyContract address.", function() {
        return chronoMint.getAddress.call(1).then(function(r) {
            assert.equal(r,timeProxyContract.address);
        });
    });

    it("can provide LHProxyContract address.", function() {
        return chronoMint.getAddress.call(2).then(function(r) {
            assert.equal(r,lhProxyContract.address);
        });
    });

    it("can provide ExchangeContract address.", function() {
        return chronoMint.getOtherAddress.call(1).then(function(r) {
            assert.equal(r,exchange.address);
        });
    });

    it("can provide RewardsContract address.", function() {
        return chronoMint.getOtherAddress.call(2).then(function(r) {
            assert.equal(r,rewards.address);
        });
    });

    it("allows a CBE key to set the contract address", function() {
        return chronoMint.setAddress("0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function(r) {
            return chronoMint.getAddress.call(3).then(function(r){
                return chronoMint.contractsCounter.call().then(function(r2) {
                    assert.equal(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
                    assert.equal(r2,4);
                });
            });
        });
    });

    it("doesn't allow a non CBE key to set the contract address", function() {
        return chronoMint.setAddress("0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a", {from: nonOwner}).then(function() {
            return chronoMint.getAddress.call(4).then(function(r){
                return chronoMint.contractsCounter.call().then(function(r2) {
                    assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703a');
                    assert.notEqual(r2,5);
                });
            });
        });
    });

    it("allows a CBE key to remove the contract address", function() {
        return chronoMint.removeAddress("0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b").then(function(r) {
            return chronoMint.getAddress.call(3).then(function(r){
                return chronoMint.contractsCounter.call().then(function(r2) {
                    assert.notEqual(r, '0x473f93cbebb8b24e4bf14d79b8ebd7e65a8c703b');
                    assert.equal(r2,3);
                });
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

    it("Proposed LOC should increment LOCs counter", function() {
        return chronoMint.getLOCCount.call().then(function(r){
            assert.equal(r, 1);
        });
    });

    it("allows CBE member to remove LOC", function() {
        return chronoMint.removeLOC.call(loc_contracts[0].address).then(function(r) {
            return chronoMint.removeLOC(loc_contracts[0].address).then(function() {
                assert.isOk(r);
            });
        });
    });

    it("Removed LOC should decrement LOCs counter", function() {
        return chronoMint.getLOCCount.call().then(function(r){
            assert.equal(r, 0);
        });
    });

    it("allow CBE member to set his IPFS orbit-db hash", function() {
        return chronoMint.setMemberHash(owner,'QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB').then(function(){
            return chronoMint.getMemberHash.call(owner).then(function(r){
                assert.equal(r,'QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB');
            });
        });
    });

    it("allows one CBE key to add another CBE key.", function() {
        return chronoMint.addKey(owner1).then(function() {
            return chronoMint.isAuthorized.call(owner1).then(function(r){
                assert.isOk(r);
            });
        });
    });

    it("required signers should be 2", function() {
        return chronoMint.required.call({from: owner}).then(function(r) {
            assert.equal(r, 2);
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

    it("pending operation counter should be 0", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("required signers should be 3", function() {
        return chronoMint.required.call({from: owner}).then(function(r) {
            assert.equal(r, 3);
        });
    });

});

context("with three CBE keys", function(){

    it("allows 2 votes for the new key to grant authorization.", function() {
        return chronoMint.addKey(owner3, {from: owner2}).then(function(r) {
            conf_sign = r.logs[0].args.operation;
            return chronoMint.confirm(conf_sign,{from:owner}).then(function() {
                return chronoMint.confirm(conf_sign,{from:owner1}).then(function() {
                    return chronoMint.isAuthorized.call(owner3).then(function(r){
                        assert.isOk(r);
                    });
                });
            });
        });
    });

    it("pending operation counter should be 0", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("required signers should be 4", function() {
        return chronoMint.required.call({from: owner}).then(function(r) {
            assert.equal(r, 4);
        });
    });

});

context("with four CBE keys", function(){

    it("allows 3 votes for the new key to grant authorization.", function() {
        return chronoMint.addKey(owner4, {from: owner3}).then(function(r) {
            conf_sign = r.logs[0].args.operation;
            return chronoMint.confirm(conf_sign,{from:owner}).then(function() {
                return chronoMint.confirm(conf_sign,{from:owner1}).then(function() {
                    return chronoMint.confirm(conf_sign,{from:owner2}).then(function() {
                        return chronoMint.isAuthorized.call(owner3).then(function(r){
                            assert.isOk(r);
                        });
                    });
                });
            });
        });
    });

    it("pending operation counter should be 0", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("required signers should be 5", function() {
        return chronoMint.required.call({from: owner}).then(function(r) {
            assert.equal(r, 5);
        });
    });

});

context("with five CBE keys", function(){
    it("collects 4 vote to addKey and granting auth.", function() {
        return chronoMint.addKey(owner5, {from: owner4}).then(function(r) {
            conf_sign = r.logs[0].args.operation;
            return chronoMint.confirm(conf_sign,{from:owner}).then(function() {
                return chronoMint.confirm(conf_sign,{from:owner1}).then(function() {
                    return chronoMint.confirm(conf_sign,{from:owner2}).then(function() {
                        return chronoMint.confirm(conf_sign,{from:owner3}).then(function() {
                            return chronoMint.isAuthorized.call(owner5).then(function(r){
                                assert.isOk(r);
                            });
                        });
                    });
                });
            });
        });
    });

    it("can show all members", function() {
        return chronoMint.getMembers.call().then(function(r) {
            assert.equal(r.length,6);
        });
    });

    it("required signers should be 6", function() {
        return chronoMint.required.call({from: owner}).then(function(r) {
            assert.equal(r, 6);
        });
    });


    it("pending operation counter should be 0", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("collects 1 call and 1 vote for setAddress as 2 votes for a new address", function() {
        return chronoMint.setAddress("0x19789eeec7aac794b49f370783623a421df3f177").then(function(r) {
            conf_sign = r.logs[0].args.operation;
            return chronoMint.confirm(conf_sign, {from:owner1}).then(function() {
                return chronoMint.getAddress.call(3).then(function(r){
                    assert.notEqual(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                });
            });
        });
    });

    it("pending operation counter should be 1", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 1);
        });
    });

    it("confirmation yet needed should be 4", function() {
        return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
            assert.equal(r,4);
        });
    });

    it("check owner hasConfirmed new addrees", function() {
        return chronoMint.hasConfirmed.call(conf_sign, owner).then(function(r) {
            assert.isOk(r);
        });
    });

    it("revoke owner1 and check not hasConfirmed new addrees", function() {
        return chronoMint.revoke(conf_sign,{from:owner}).then(function() {
            return chronoMint.hasConfirmed.call(conf_sign, owner).then(function(r) {
                assert.isNotOk(r);
            });
        });
    });

    it("check confirmation yet needed should be 5", function() {
        return chronoMint.pendingYetNeeded.call(conf_sign).then(function(r) {
            assert.equal(r,5);
        });
    });

    it("allows owner and 4 more votes to set new address.", function() {
        return chronoMint.confirm(conf_sign, {from: owner}).then(function() {
            return chronoMint.confirm(conf_sign, {from: owner2}).then(function() {
                return chronoMint.confirm(conf_sign, {from: owner3}).then(function() {
                    return chronoMint.confirm(conf_sign, {from: owner4}).then(function() {
                        return chronoMint.confirm(conf_sign, {from: owner5}).then(function() {
                            return chronoMint.getAddress.call(3).then(function(r){
                                assert.equal(r, '0x19789eeec7aac794b49f370783623a421df3f177');
                            });
                        });
                    });
                });
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

    it("Proposed LOC should increment LOCs counter", function() {
        return chronoMint.getLOCCount.call().then(function(r){
            assert.equal(r, 1);
        });
    });

    it("ChronoMint should be able to return LOCs array with proposed LOC address", function() {
        return chronoMint.getLOCs.call().then(function(r){
            assert.equal(r[0], loc_contracts[0].address);
        });
    });


    it("allows 5 CBE members to activate an LOC.", function() {
        return chronoMint.setLOCStatus(loc_contracts[0].address, Status.active, {from: owner}).then(function(r) {
            chronoMint.confirm(r.logs[0].args.operation,{from:owner1}).then(function(r) {
                chronoMint.confirm(r.logs[0].args.operation,{from:owner2}).then(function(r) {
                    chronoMint.confirm(r.logs[0].args.operation,{from:owner3}).then(function(r) {
                        chronoMint.confirm(r.logs[0].args.operation,{from:owner4}).then(function(r) {
                            chronoMint.confirm(r.logs[0].args.operation,{from:owner5}).then(function(r) {
                                return loc_contracts[0].status.call().then(function(r){
                                    assert.equal(r, Status.active);
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("collects call to setValue and first vote for a new value ", function() {
        return chronoMint.setLOCValue(loc_contracts[0].address,12,22).then(function(r) {
            conf_sign = r.logs[0].args.operation;
            return loc_contracts[0].getValue.call(12).then(function(r){
                assert.notEqual(r, 22);
                return chronoMint.confirm(conf_sign, {from: owner1}).then(function() {
                    return loc_contracts[0].getValue.call(12).then(function(r){
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
                var ret = r;
                assert.isOk(ret);
            });
        });
    });

    it("should increment pending operation counter ", function() {
        return chronoMint.pendingsCount.call().then(function(r) {
            assert.equal(r, 2);
        });
    });

    it("allows a 3 more votes to set new value.", function() {
        return chronoMint.confirm(conf_sign, {from: owner2}).then(function() {
            return chronoMint.confirm(conf_sign, {from: owner3}).then(function() {
                return chronoMint.confirm(conf_sign, {from: owner4}).then(function() {
                    return chronoMint.confirm(conf_sign, {from: owner5}).then(function() {
                        return loc_contracts[0].getValue.call(12).then(function(r){
                            assert.equal(r, 22);
                        });
                    });
                });
            });
        });
    });

    it("doesn't allow non CBE to change settings for the contract.", function() {
        return loc_contracts[0].setValue(3, 2000).then(function() {
            return loc_contracts[0].getValue.call(3).then(function(r){
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

    it("should decrement pending operation counter ", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 1);
        });
    });

    it("allows 4 CBE member vote for the revocation to revoke authorization.", function() {
        return chronoMint.confirm(conf_sign2,{from:owner}).then(function() {
            return chronoMint.confirm(conf_sign2,{from:owner1}).then(function() {
                return chronoMint.confirm(conf_sign2,{from:owner2}).then(function() {
                    return chronoMint.confirm(conf_sign2,{from:owner3}).then(function() {
                        return chronoMint.confirm(conf_sign2,{from:owner4}).then(function() {
                            return chronoMint.confirm(conf_sign2,{from:owner5}).then(function() {
                                return chronoMint.isAuthorized.call(owner5).then(function(r){
                                    assert.isNotOk(r);
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should decrement pending operation counter ", function() {
        return chronoMint.pendingsCount.call({from: owner}).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("ChronoMint can provide TimeProxyContract address.", function() {
        return chronoMint.getAddress.call(1).then(function(r) {
            assert.equal(r,timeProxyContract.address);
        });
    });

    it("should show 10000 TIME balance", function() {
        return chronoMint.getBalance.call(1).then(function(r) {
            assert.equal(r, 10000);
        });
    });

    it("should not be abble to reIssue 5000 more TIME", function() {
        return chronoMint.reissueAsset.call(SYMBOL, 5000, {from: accounts[0]}).then((r) => {
            return chronoMint.reissueAsset(SYMBOL, 5000, {from: accounts[0]}).then(() => {
                assert.isNotOk(r);
            });
        });
    });

    it("should show 10000 TIME balance", function() {
        return chronoMint.getBalance.call(1).then(function(r) {
            assert.equal(r, 10000);
        });
    });

    it("ChronoMint should be able to send 100 TIME to owner", function() {
        return chronoMint.sendAsset.call(1,owner,100).then(function(r) {
            return chronoMint.sendAsset(1,owner,100,{from: accounts[0], gas: 3000000}).then(function() {
                assert.isOk(r);
            });
        });
    });

    it("check Owner has 100 TIME", function() {
        return timeProxyContract.balanceOf.call(owner).then(function(r) {
            assert.equal(r,100);
        });
    });

    it("ChronoMint should be able to send 100 TIME to owner1", function() {
        return chronoMint.sendAsset.call(1,owner1,100).then(function(r) {
            return chronoMint.sendAsset(1,owner1,100,{from: accounts[0], gas: 3000000}).then(function() {
                assert.isOk(r);
            });
        });
    });

    it("check Owner1 has 100 TIME", function() {
        return timeProxyContract.balanceOf.call(owner1).then(function(r) {
            assert.equal(r,100);
        });
    });

    it("can provide account balances for Y account started from X", function() {
        return chronoMint.getAssetBalances.call('TIME',1,2).then(function(r) {
            assert.equal(r[0].length,2);
        });
    });

    it("owner should be able to approve 50 TIME to Reward", function() {
        return timeProxyContract.approve.call(rewards.address, 50, {from: accounts[0]}).then((r) => {
            return timeProxyContract.approve(rewards.address, 50, {from: accounts[0]}).then(() => {
                assert.isOk(r);
            });
        });
    });

    it("ChronoMint can provide LHProxyContract address.", function() {
        return chronoMint.getAddress.call(2).then(function(r) {
            assert.equal(r,lhProxyContract.address);
        });
    });

    it("should show 0 LHT balance", function() {
        return chronoMint.getBalance.call(2).then(function(r) {
            assert.equal(r, 0);
        });
    });

    it("should be abble to reIssue 5000 more LHT", function() {
            return chronoMint.reissueAsset(SYMBOL2, 5000, {from: owner}).then((r) => {
              conf_sign = r.logs[0].args.operation;
                return chronoMint.confirm(conf_sign,{from:owner4}).then(function() {
                return chronoMint.confirm(conf_sign,{from:owner1}).then(function() {
                    return chronoMint.confirm(conf_sign,{from:owner2}).then(function() {
                        return chronoMint.confirm(conf_sign,{from:owner3}).then(function() {
                          return chronoMint.getBalance.call(2).then(function(r) {
                              assert.equal(r, 5000);
                          });
                        });
                    });
                })
            });
        });
    });


    it("should be able to send 50 LHT to owner", function() {
        return chronoMint.sendAsset.call(2,owner,50).then(function(r) {
            return chronoMint.sendAsset(2,owner,50,{from: accounts[0], gas: 3000000}).then(function() {
                assert.isOk(r);
            });
        });
    });

    it("check Owner has 50 LHT", function() {
        return lhProxyContract.balanceOf.call(owner).then(function(r) {
            assert.equal(r,50);
        });
    });

    it("should be able to set Buy and Sell Exchange rates", function() {
        return chronoMint.setExchangePrices(10,20,{
            from: accounts[0],
            gas: 3000000
        }).then(function() {
            return exchange.buyPrice.call().then(function(r) {
                return exchange.sellPrice.call().then(function(r2) {
                    assert.equal(r,10);
                    assert.equal(r2,20);
                });
            });
        });
    });

    it("should be able to send 100 LHT to owner", function() {
        return chronoMint.sendAsset.call(2,exchange.address,100).then(function(r) {
            return chronoMint.sendAsset(2,exchange.address,100,{from: accounts[0], gas: 3000000}).then(function() {
                assert.isOk(r);
            });
        });
    });

    it("checks that Exchange has 1000 ETH and 100 LHT", function() {
        return lhProxyContract.balanceOf.call(exchange.address).then(function(r2) {
            assert.equal(web3.eth.getBalance(exchange.address),1000);
            assert.equal(r2,100);
        });
    });

    it("should allow owner to buy 10 LHT for 20 Eth each", function() {
        return exchange.buy(10,20,{value:10*20}).then(function() {
            return lhProxyContract.balanceOf.call(owner).then(function(r) {
                assert.equal(r,60);
            });
        });
    });

    it("should allow owner to sell 10 LHT for 10 Eth each", function() {
        return lhProxyContract.approve(exchange.address,10).then(function() {
            var old_balance = web3.eth.getBalance(owner);
            return exchange.sell(10,10).then(function(r) {
                return lhProxyContract.balanceOf.call(owner).then(function(r) {
                    assert.equal(r,50);
                });
            });
        });
    });

    it("check Owner has 100 TIME", function() {
        return timeProxyContract.balanceOf.call(owner).then(function(r) {
            assert.equal(r,100);
        });
    });

});
});

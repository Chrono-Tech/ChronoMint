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
var Vote = artifacts.require("./Vote.sol");
var Reverter = require('./helpers/reverter');
var bytes32 = require('./helpers/bytes32');
var exec = require('sync-exec');

contract('Vote', function(accounts) {
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
    var vote;
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
            return Vote.deployed()
        }).then(function(instance) {
            vote = instance;
            return chronoMint.setAddress(ChronoBankAssetWithFeeProxy.address, {from: accounts[0]})
        }).then(function(instance) {
            web3.eth.sendTransaction({to: Exchange.address, value: BALANCE_ETH, from: accounts[0]});
            done();
        }).catch(function (e) { console.log(e); });
    });

    context("before", function() {
        it("Platform has correct TIME proxy address.", function() {
            return platform.proxies.call(SYMBOL).then(function(r) {
                assert.equal(r,timeProxyContract.address);
            });
        });

        it("TIME contract has correct TIME proxy address.", function() {
            return timeContract.proxy.call().then(function(r) {
                assert.equal(r,timeProxyContract.address);
            });
        });

        it("TIME proxy has right version", function() {
            return timeProxyContract.getLatestVersion.call().then(function(r) {
                assert.equal(r,timeContract.address);
            });
        });

    });

    context("owner shares deposit", function(){

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

       it("owner should be able to approve 50 TIME to Vote", function() {
        return timeProxyContract.approve.call(vote.address, 50, {from: accounts[0]}).then((r) => {
            return timeProxyContract.approve(vote.address, 50, {from: accounts[0]}).then(() => {
                assert.isOk(r);
            });
        });
       });

       it("should be able to deposit 50 TIME from owner", function() {
        return vote.deposit.call(50, {from: accounts[0]}).then((r) => {
            return vote.deposit(50, {from: accounts[0]}).then(() => {
                assert.isOk(r);
            });
        });
       });

       it("should show 50 TIME owner balance", function() {
        return vote.depositBalance.call(owner, {from: accounts[0]}).then((r) => {
                assert.equal(r,50);
        });
       });

       it("should be able to withdraw 25 TIME from owner", function() {
        return vote.withdrawShares.call(25, {from: accounts[0]}).then((r) => {
        	return vote.withdrawShares(25, {from: accounts[0]}).then(() => {
                	assert.isOk(r);
                });
        });
       });

       it("should show 25 TIME owner balance", function() {
        return vote.depositBalance.call(owner, {from: accounts[0]}).then((r) => {
                assert.equal(r,25);
        });
       });

    });

    context("voting", function(){

       it("should be able to create Poll", function() {
        return vote.NewPoll.call([bytes32('1'),bytes32('2')],bytes32('New Poll'),150, 2, 123, {from: owner}).then((r) => {
            return vote.NewPoll([bytes32('1'),bytes32('2')],bytes32('New Poll'),150, 2, 123, {from: owner, gas:3000000}).then((r2) => {
                assert.equal(r,0);
            });
        });
      });

       it("owner should be able to add IPFS hash to Poll", function() {
        return vote.addIpfsHashToPoll.call(0,'1234567890', {from: owner}).then((r) => {
            return vote.addIpfsHashToPoll(0,'1234567890', {from: owner, gas:3000000}).then((r2) => {
                assert.isOk(r);
            });
        });
      });

       it("owner1 shouldn't be able to add IPFS hash to Poll", function() {
        return vote.addIpfsHashToPoll.call(0,'1234567890', {from: owner1}).then((r) => {
            return vote.addIpfsHashToPoll(0,'1234567890', {from: owner1, gas:3000000}).then((r2) => {
                assert.isNotOk(r);
            });
        });
      });

       it("should provide IPFS hashes list from Poll by ID", function() {
        return vote.getIpfsHashesFromPoll.call(0, {from: owner}).then((r) => {
                assert.equal(r.length,1);
        });
      });

      it("should be able to show Poll titles", function() {
        return vote.getPollTitles.call({from: owner}).then((r) => {
                assert.equal(r.length,1);
            });
        });

      it("owner should be able to vote Poll 0, Option 1", function() {
        return vote.vote.call(0,1, {from: owner}).then((r) => {
             return vote.vote(0,1, {from: owner}).then((r2) => {
                assert.isOk(r);
            });
        });
      });

      it("owner shouldn't be able to vote Poll 0 twice", function() {
        return vote.vote.call(0,1, {from: owner}).then((r) => {
             return vote.vote.call(0,2, {from: owner}).then((r2) => {
                assert.isNotOk(r);
                assert.isNotOk(r2);
            });
        });
      });

      it("should be able to get Polls list owner took part", function() {
        return vote.getMemberPolls.call({from: owner}).then((r) => {
        assert.equal(r.length,1);
       });
      });

       it("should be able to create another Poll", function() {
        return vote.NewPoll.call([bytes32('1'),bytes32('2')],bytes32('New Poll2'),150, 2, 123, {from: accounts[0]}).then((r) => {
            return vote.NewPoll([bytes32('1'),bytes32('2')],bytes32('New Poll2'),150, 2, 123, {from: accounts[0], gas:3000000}).then((r2) => {
                assert.equal(r,1);
            });
        });
      });

      it("owner should be able to vote Poll 1, Option 1", function() {
        return vote.vote.call(1,1, {from: owner}).then((r) => {
             return vote.vote(1,1, {from: owner}).then((r2) => {
                assert.isOk(r);
            });
        });
      });

      it("should be able to get Polls list voter took part", function() {
        return vote.getMemberPolls.call({from: owner}).then((r) => {
        assert.equal(r.length,2);
       });
      }); 

      it("should be able to show Poll by id", function() {
        return vote.polls.call(0, {from: owner}).then((r) => {
          return vote.polls.call(1, {from: owner}).then((r2) => {
                assert.equal(r[1],bytes32('New Poll'));
                assert.equal(r2[1],bytes32('New Poll2'));
            });
          });
        });
      
      it("owner1 shouldn't be able to vote Poll 0, Option 1", function() {
        return vote.vote.call(0,1, {from: owner1}).then((r) => {
                assert.isNotOk(r);
            });
      });


    });

    context("owner1 shares deposit and voting", function(){

        it("ChronoMint should be able to send 50 TIME to owner1", function() {
            return chronoMint.sendAsset.call(1,owner1,50).then(function(r) {
                return chronoMint.sendAsset(1,owner1,50,{from: accounts[0], gas: 3000000}).then(function() {
                    assert.isOk(r);
                });
            });
        });

        it("check Owner1 has 50 TIME", function() {
            return timeProxyContract.balanceOf.call(owner1).then(function(r) {
                assert.equal(r,50);
            });
        });

       it("owner1 should be able to approve 50 TIME to Vote", function() {
        return timeProxyContract.approve.call(vote.address, 50, {from: owner1}).then((r) => {
            return timeProxyContract.approve(vote.address, 50, {from: owner1}).then(() => {
                assert.isOk(r);
            });
        });
       });

       it("should be able to deposit 50 TIME from owner", function() {
        return vote.deposit.call(50, {from: owner1}).then((r) => {
            return vote.deposit(50, {from: owner1}).then(() => {
                assert.isOk(r);
            });
        });
       });

       it("should show 50 TIME owner1 balance", function() {
        return vote.depositBalance.call(owner1, {from: owner1}).then((r) => {
                assert.equal(r,50);
        });
       });

      it("owner1 should be able to vote Poll 0, Option 0", function() {
        return vote.vote.call(0,1, {from: owner1}).then((r) => {
             return vote.vote(0,1, {from: owner1}).then((r2) => {
                assert.isOk(r);
            });
        });
      });

      it("should be able to get Polls list owner1 took part", function() {
        return vote.getMemberPolls.call({from: owner1}).then((r) => {
        assert.equal(r.length,1);
       });
      });

    });

});


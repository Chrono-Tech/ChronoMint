var ChronoBankPlatform = artifacts.require("./ChronoBankPlatform.sol");
var ChronoBankPlatformEmitter = artifacts.require("./ChronoBankPlatformEmitter.sol");
var EventsHistory = artifacts.require("./EventsHistory.sol");
var ChronoBankAssetProxy = artifacts.require("./ChronoBankAssetProxy.sol");
var ChronoBankAssetWithFeeProxy = artifacts.require("./ChronoBankAssetWithFeeProxy.sol");
var ChronoBankAsset = artifacts.require("./ChronoBankAsset.sol");
var ChronoBankAssetWithFee = artifacts.require("./ChronoBankAssetWithFee.sol");
var ChronoMint = artifacts.require("./ChronoMint.sol");
var Exchange = artifacts.require("./Exchange.sol");
var Rewards = artifacts.require("./Rewards.sol");
const truffleConfig = require('../truffle-config.js')
const Web3 = require('../node_modules/web3')
const web3Location = `http://localhost:8545`;
const web3 = new Web3(new Web3.providers.HttpProvider(web3Location));
const SYMBOL = 'TIME';
const SYMBOL2 = 'LHT';
const NAME = 'Time Token';
const DESCRIPTION = 'ChronoBank Time Shares';
const NAME2 = 'Labour-hour Token';
const DESCRIPTION2 = 'ChronoBank Lht Assets';
const BASE_UNIT = 2;
const IS_REISSUABLE = true;
const IS_NOT_REISSUABLE = false;
const fakeArgs = [0,0,0,0,0,0,0,0];
const accounts = web3.eth.accounts;
var chronoBankPlatform;
var chronoMint;
var eventsHistory;
var chronoBankPlatformEmitter;
var rewards;
var exchange;

module.exports = function() {
    return ChronoBankPlatform.deployed().then(function (instance) {
        chronoBankPlatform = instance;
        return ChronoMint.deployed()
    }).then(function (instance) {
        chronoMint = instance;
    }).then(() => {
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
        console.log(r)
        return chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, SYMBOL, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankPlatform.address, SYMBOL, NAME, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.proposeUpgrade(ChronoBankAsset.address, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
        return ChronoBankAsset.deployed()
    }).then(function (instance) {
        return instance.init(ChronoBankAssetProxy.address, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
        return ChronoBankAssetProxy.deployed()
    }).then(function (instance) {
        return instance.transfer(ChronoMint.address, 10000, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
        return chronoBankPlatform.changeOwnership(SYMBOL, chronoMint.address, {from: accounts[0]})
    }).then(function (r) {
        console.log(r)
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
        return chronoMint.claimExchangeOwnership(Exchange.address, {from: accounts[0]})
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
    }).catch(function (e) { console.log(e); });
}

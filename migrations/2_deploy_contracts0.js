var ChronoBankPlatform = artifacts.require("./ChronoBankPlatform.sol");
var ChronoBankPlatformTestable = artifacts.require("./ChronoBankPlatformTestable.sol");
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
accounts = web3.eth.accounts;
module.exports = function(deployer) {
    return deployer.deploy(EventsHistory).then(function () {
        return deployer.deploy(ChronoBankPlatform).then(function () {
            return deployer.deploy(ChronoBankAsset).then(function () {
                return deployer.deploy(ChronoBankAssetWithFee).then(function () {
                    return deployer.deploy(ChronoBankAssetProxy).then(function () {
                        return deployer.deploy(ChronoBankAssetWithFeeProxy).then(function () {
                            return deployer.deploy(Rewards).then(function () {
                                return deployer.deploy(Exchange).then(function () {
                                    return deployer.deploy(EternalStorage).then(function () {
                                        return deployer.deploy(Vote, ChronoBankAssetProxy.address).then(function () {
                                            return deployer.deploy(ChronoMint, EternalStorage.address, ChronoBankAssetProxy.address, Rewards.address, Exchange.address, ChronoBankAssetWithFeeProxy.address).then(function () {
                                                return deployer.deploy(LOC).then(function () {
                                                    return deployer.deploy(ChronoBankPlatformEmitter).then(function () {

                                                        return ChronoBankPlatform.deployed().then(function (instance) {
                                                            var chronoBankPlatform = instance;
                                                            return ChronoBankPlatformEmitter.deployed().then(function (instance) {
                                                                var chronoBankPlatformEmitter = instance;

                                                                chronoBankPlatform.setupEventsHistory(EventsHistory.address, {from: accounts[0]}).then((r) => {

                                                                    EventsHistory.deployed().then(function (instance) {
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                        instance.addEmitter(chronoBankPlatformEmitter.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                                    });
                                                                    chronoBankPlatform.issueAsset(SYMBOL, 10000, NAME, DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE, {
                                                                        from: accounts[0],
                                                                        gas: 3000000
                                                                    }).then(() => {
                                                                        chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, SYMBOL, {from: accounts[0]}).then(() => {
                                                                            ChronoBankAssetProxy.deployed().then(function (instance) {
                                                                                instance.init(ChronoBankPlatform.address, SYMBOL, NAME, {from: accounts[0]}).then(() => {
                                                                                    ChronoBankAssetProxy.deployed().then(function (instance) {
                                                                                        instance.proposeUpgrade(ChronoBankAsset.address, {from: accounts[0]}).then(() => {
                                                                                            ChronoBankAsset.deployed().then(function (instance) {
                                                                                                instance.init(ChronoBankAssetProxy.address, {from: accounts[0]}).then(() => {
                                                                                                    ChronoBankAssetProxy.deployed().then(function (instance) {
                                                                                                        instance.transfer(ChronoMint.address, 10000, {from: accounts[0]}).then(() => {
                                                                                                            chronoBankPlatform.changeOwnership(SYMBOL, ChronoMint.address, {from: accounts[0]}).then((r) => {

                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                    chronoBankPlatform.issueAsset(SYMBOL2, 0, NAME2, DESCRIPTION2, BASE_UNIT, IS_REISSUABLE, {
                                                                        from: accounts[0],
                                                                        gas: 3000000
                                                                    }).then(() => {
                                                                        chronoBankPlatform.setProxy(ChronoBankAssetWithFeeProxy.address, SYMBOL2, {from: accounts[0]}).then((r) => {
                                                                            ChronoBankAssetWithFeeProxy.deployed().then(function (instance) {
                                                                                instance.init(ChronoBankPlatform.address, SYMBOL2, NAME2, {from: accounts[0]}).then((r) => {
                                                                                    ChronoBankAssetWithFeeProxy.deployed().then(function (instance) {
                                                                                        instance.proposeUpgrade(ChronoBankAssetWithFee.address, {from: accounts[0]}).then((r) => {
                                                                                            ChronoBankAssetWithFee.deployed().then(function (instance) {
                                                                                                instance.init(ChronoBankAssetWithFeeProxy.address, {from: accounts[0]}).then((r) => {
                                                                                                    ChronoBankPlatform.deployed().then(function (instance) {
                                                                                                        instance.changeOwnership(SYMBOL2, ChronoMint.address, {from: accounts[0]}).then((r) => {
                                                                                                            chronoBankPlatform.changeContractOwnership(ChronoMint.address, {from: accounts[0]}).then((r) => {
                                                                                                                ChronoMint.deployed().then(function (instance) {
                                                                                                                    instance.claimPlatformOwnership(ChronoBankPlatform.address, {from: accounts[0]}).then((r) => {
                                                                                                                        Exchange.deployed().then(function (instance) {
                                                                                                                            var exchange = instance;
                                                                                                                            exchange.init(ChronoBankAssetWithFeeProxy.address).then(function () {
                                                                                                                                exchange.changeContractOwnership(ChronoMint.address, {from: accounts[0]}).then((r) => {
                                                                                                                                    ChronoMint.deployed().then(function (instance) {
                                                                                                                                        instance.claimExchangeOwnership(Exchange.address, {from: accounts[0]}).then((r) => {
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                });
                                                                                                                            });
                                                                                                                        });
                                                                                                                        Rewards.deployed().then(function (instance) {
                                                                                                                            var rewards = instance;
                                                                                                                            rewards.init(ChronoBankAssetProxy.address, 90).then(function () {

                                                                                                                            });
                                                                                                                        });

                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });

                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
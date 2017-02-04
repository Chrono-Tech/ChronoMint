const truffleConfig = require('../truffle.js')
const Web3 = require('../node_modules/web3')
const web3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;
const web3 = new Web3(new Web3.providers.HttpProvider(web3Location));
const SYMBOL = 'TIME';
const SYMBOL2 = 'LHT';
const NAME = 'Time Token';
const DESCRIPTION = 'ChronoBank Time Shares';
const NAME2 = 'Labour-hour Token';
const DESCRIPTION2 = 'ChronoBank Lht Assets';
const BASE_UNIT = 2;
const IS_REISSUABLE = true;
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
                                        return deployer.deploy(ChronoMint, EternalStorage.address, ChronoBankAsset.address, Rewards.address, Exchange.address, ChronoBankAssetProxy.address).then(function () {
                                            return deployer.deploy(LOC).then(function () {
                                                return deployer.deploy(ChronoBankPlatformEmitter).then(function () {
                                                    ChronoBankPlatform.deployed().setupEventsHistory(EventsHistory.address, {from: accounts[0]}).then((r) => {
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        EventsHistory.deployed().addEmitter(ChronoBankPlatformEmitter.deployed().contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10), ChronoBankPlatformEmitter.address, {from: accounts[0]});
                                                        ChronoBankAssetProxy.deployed().init(ChronoBankPlatform.address, SYMBOL, NAME, {from: accounts[0]}).then((r) => {
                                                            ChronoBankAssetProxy.deployed().proposeUpgrade(ChronoBankAsset.address, {from: accounts[0]}).then((r) => {
                                                                ChronoBankAsset.deployed().init(ChronoBankAssetProxy.address, {from: accounts[0]}).then((r) => {
                                                                    ChronoBankPlatform.deployed().setProxy(ChronoBankAssetProxy.address, SYMBOL, {from: accounts[0]}).then((r) => {
                                                                        ChronoBankPlatform.deployed().changeContractOwnership(ChronoMint.address, {from: accounts[0]}).then((r) => {
                                                                            ChronoMint.deployed().claimOwnership(ChronoBankPlatform.address, {from: accounts[0]}).then((r) => {
                                                                                console.log(r);
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

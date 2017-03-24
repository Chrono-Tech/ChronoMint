let ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol');
let ChronoBankPlatformEmitter = artifacts.require('./ChronoBankPlatformEmitter.sol');
let EventsHistory = artifacts.require('./EventsHistory.sol');
let ChronoBankAssetProxy = artifacts.require('./ChronoBankAssetProxy.sol');
let ChronoBankAssetWithFeeProxy = artifacts.require('./ChronoBankAssetWithFeeProxy.sol');
let ChronoBankAsset = artifacts.require('./ChronoBankAsset.sol');
let ChronoBankAssetWithFee = artifacts.require('./ChronoBankAssetWithFee.sol');
let ChronoMint = artifacts.require('./ChronoMint.sol');
let ContractsManager = artifacts.require('./ContractsManager.sol');
let Exchange = artifacts.require('./Exchange.sol');
let Rewards = artifacts.require('./Rewards.sol');

const Web3 = require('../node_modules/web3');
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
const fakeArgs = [0, 0, 0, 0, 0, 0, 0, 0];
const accounts = web3.eth.accounts;
const params = {from: accounts[0]};
const paramsGas = {from: accounts[0], gas: 3000000};

let chronoBankPlatform;
let chronoMint;
let contractsManager;
let eventsHistory;
let chronoBankPlatformEmitter;
let rewards;
let exchange;

module.exports = () => {
    return ChronoBankPlatform.deployed()
        .then(instance => {
            chronoBankPlatform = instance;
            return ChronoMint.deployed()
        }).then(instance => {
            chronoMint = instance;
        }).then(() => {
            return ContractsManager.deployed()
        }).then(instance => {
            contractsManager = instance;
        }).then(() => {
            return ChronoBankPlatformEmitter.deployed()
        }).then(instance => {
            chronoBankPlatformEmitter = instance;
            return EventsHistory.deployed()
        }).then(instance => {
            eventsHistory = instance;
            return chronoBankPlatform.setupEventsHistory(EventsHistory.address, {
                from: accounts[0],
                gas: 3000000
            });
        })

        .then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        }).then(() => {
            return eventsHistory.addEmitter(
                chronoBankPlatformEmitter.contract.emitError.getData.apply(this, fakeArgs).slice(0, 10),
                ChronoBankPlatformEmitter.address, paramsGas
            );
        })

        .then(() => {
            return eventsHistory.addVersion(chronoBankPlatform.address, 'Origin', 'Initial version.');
        }).then(() => {
            return chronoBankPlatform
                .issueAsset(SYMBOL, 10000, NAME, DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE, paramsGas)
        }).then(r => {
            console.log(r);
            return chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, SYMBOL, params)
        }).then(r => {
            console.log(r);
            return ChronoBankAssetProxy.deployed()
        }).then(instance => {
            return instance.init(ChronoBankPlatform.address, SYMBOL, NAME, params)
        }).then(r => {
            console.log(r);
            return ChronoBankAssetProxy.deployed()
        }).then(instance => {
            return instance.proposeUpgrade(ChronoBankAsset.address, params)
        }).then(r => {
            console.log(r);
            return ChronoBankAsset.deployed()
        }).then(instance => {
            return instance.init(ChronoBankAssetProxy.address, params)
        }).then(r => {
            console.log(r);
            return ChronoBankAssetProxy.deployed()
        }).then(instance => {
            return instance.transfer(ChronoMint.address, 10000, params)
        }).then(r => {
            console.log(r);
            return chronoBankPlatform.changeOwnership(SYMBOL, ContractsManager.address, params)
        }).then(r => {
            console.log(r);
            return chronoBankPlatform.issueAsset(SYMBOL2, 0, NAME2, DESCRIPTION2, BASE_UNIT, IS_REISSUABLE, {
                from: accounts[0],
                gas: 3000000
            })
        }).then(() => {
            return chronoBankPlatform.setProxy(ChronoBankAssetWithFeeProxy.address, SYMBOL2, params)
        }).then(() => {
            return ChronoBankAssetWithFeeProxy.deployed()
        }).then(instance => {
            return instance.init(ChronoBankPlatform.address, SYMBOL2, NAME2, params)
        }).then(() => {
            return ChronoBankAssetWithFeeProxy.deployed()
        }).then(instance => {
            return instance.proposeUpgrade(ChronoBankAssetWithFee.address, params)
        }).then(() => {
            return ChronoBankAssetWithFee.deployed()
        }).then(instance => {
            return instance.init(ChronoBankAssetWithFeeProxy.address, params)
        }).then(() => {
            return chronoBankPlatform.changeOwnership(SYMBOL2, ContractsManager.address, params)
        }).then(() => {
            return chronoBankPlatform.changeContractOwnership(ContractsManager.address, params)
        }).then(() => {
            return contractsManager.claimPlatformOwnership(ChronoBankPlatform.address, params)
        })

        .then(() => {
            return Exchange.deployed()
        }).then(instance => {
            exchange = instance;
            return exchange.init(ChronoBankAssetWithFeeProxy.address)
        }).then(() => {
            return exchange.changeContractOwnership(contractsManager.address, params)
        }).then(() => {
            return contractsManager.claimExchangeOwnership(Exchange.address, params)
        }).then(() => {
            return Rewards.deployed()
        }).then(instance => {
            rewards = instance;
            return rewards.init(ChronoBankAssetProxy.address, 0)
        }).then(() => {
            return contractsManager.setOtherAddress(rewards.address, params)
        }).then(() => {
            return contractsManager.setAddress(ChronoBankAssetProxy.address, params)
        }).then(() => {
            return contractsManager.setAddress(ChronoBankAssetWithFeeProxy.address, params)
        })

        /** EXCHANGE INIT >>> */
        .then(() => {
            return contractsManager.setExchangePrices(Exchange.address, 10000000000000000, 20000000000000000)
        }).then(() => {
            return contractsManager.reissueAsset(SYMBOL2, 2500, 0x10, paramsGas)
        }).then(() => {
            return contractsManager.sendAsset(2, Exchange.address, 500, paramsGas)
        }).then(() => {
            return contractsManager.sendAsset(2, accounts[0], 500, paramsGas)
        })
        /** <<< EXCHANGE INIT */

        .catch(function (e) {
            console.log(e);
        });
};
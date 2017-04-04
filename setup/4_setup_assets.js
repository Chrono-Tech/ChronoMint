const ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol')
const ChronoBankPlatformEmitter = artifacts.require('./ChronoBankPlatformEmitter.sol')
const EventsHistory = artifacts.require('./EventsHistory.sol')
const ChronoBankAssetProxy = artifacts.require('./ChronoBankAssetProxy.sol')
const ChronoBankAssetWithFeeProxy = artifacts.require('./ChronoBankAssetWithFeeProxy.sol')
const ChronoBankAsset = artifacts.require('./ChronoBankAsset.sol')
const ChronoBankAssetWithFee = artifacts.require('./ChronoBankAssetWithFee.sol')
const ChronoMint = artifacts.require('./ChronoMint.sol')
const ContractsManager = artifacts.require('./ContractsManager.sol')
const Exchange = artifacts.require('./Exchange.sol')
const TimeHolder = artifacts.require('./TimeHolder.sol')
const Rewards = artifacts.require('./Rewards.sol')
const Vote = artifacts.require('./Vote.sol')

const Web3 = require('../node_modules/web3')
const web3Location = `http://localhost:8545`
const web3 = new Web3(new Web3.providers.HttpProvider(web3Location))
const SYMBOL = 'TIME'
const SYMBOL2 = 'LHT'
const NAME = 'Time Token'
const DESCRIPTION = 'ChronoBank Time Shares'
const NAME2 = 'Labour-hour Token'
const DESCRIPTION2 = 'ChronoBank Lht Assets'
const BASE_UNIT = 2
const IS_REISSUABLE = true
const IS_NOT_REISSUABLE = false
const fakeArgs = [0, 0, 0, 0, 0, 0, 0, 0]
const accounts = web3.eth.accounts
const params = {from: accounts[0]}
const paramsGas = {from: accounts[0], gas: 3000000}

const bytes32Source = require('../test/helpers/bytes32')
const bytes32 = (v) => {
  return bytes32Source(web3.toHex(v), false, true)
}

let chronoBankPlatform
let chronoMint
let contractsManager
let timeHolder
let eventsHistory
let chronoBankPlatformEmitter
let rewards
let exchange

module.exports = () => {
  return ChronoBankPlatform.deployed()
    .then(i => {
      chronoBankPlatform = i
      return ChronoMint.deployed()
    })
    .then(i => {
      chronoMint = i
    })
    .then(() => {
      return ContractsManager.deployed()
    })
    .then(i => {
      contractsManager = i
    })
    .then(() => {
      return TimeHolder.deployed()
    })
    .then(i => {
      timeHolder = i
    })
    .then(() => {
      return timeHolder.addListener(Vote.address)
    })
    .then(() => {
      return timeHolder.addListener(Rewards.address)
    })
    .then(() => {
      return ChronoBankPlatformEmitter.deployed()
    })
    .then(i => {
      chronoBankPlatformEmitter = i
      return EventsHistory.deployed()
    })
    .then(i => {
      eventsHistory = i
      return chronoBankPlatform.setupEventsHistory(EventsHistory.address, {
        from: accounts[0],
        gas: 3000000
      })
    })

    .then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitTransfer.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitIssue.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitRevoke.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitOwnershipChange.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitApprove.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitRecovery.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    }).then(() => {
      return eventsHistory.addEmitter(
        chronoBankPlatformEmitter.contract.emitError.getData.apply(this, fakeArgs).slice(0, 10),
        ChronoBankPlatformEmitter.address, paramsGas
      )
    })

    .then(() => {
      return eventsHistory.addVersion(chronoBankPlatform.address, 'Origin', 'Initial version.')
    }).then(() => {
      return chronoBankPlatform
        .issueAsset(SYMBOL, 100000000, NAME, DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE, paramsGas)
    }).then(r => {
      console.log(r)
      return chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, SYMBOL, params)
    }).then(r => {
      console.log(r)
      return ChronoBankAssetProxy.deployed()
    }).then(i => {
      return i.init(ChronoBankPlatform.address, SYMBOL, NAME, params)
    }).then(r => {
      console.log(r)
      return ChronoBankAssetProxy.deployed()
    }).then(i => {
      return i.proposeUpgrade(ChronoBankAsset.address, params)
    }).then(r => {
      console.log(r)
      return ChronoBankAsset.deployed()
    }).then(i => {
      return i.init(ChronoBankAssetProxy.address, params)
    }).then(r => {
      console.log(r)
      return ChronoBankAssetProxy.deployed()
    }).then(i => {
      return i.transfer(ContractsManager.address, 100000000, params)
    }).then(r => {
      console.log(r)
      return chronoBankPlatform.changeOwnership(SYMBOL, ContractsManager.address, params)
    }).then(r => {
      console.log(r)
      return chronoBankPlatform.issueAsset(SYMBOL2, 0, NAME2, DESCRIPTION2, BASE_UNIT, IS_REISSUABLE, {
        from: accounts[0],
        gas: 3000000
      })
    }).then(() => {
      return chronoBankPlatform.setProxy(ChronoBankAssetWithFeeProxy.address, SYMBOL2, params)
    }).then(() => {
      return ChronoBankAssetWithFeeProxy.deployed()
    }).then(i => {
      return i.init(ChronoBankPlatform.address, SYMBOL2, NAME2, params)
    }).then(() => {
      return ChronoBankAssetWithFeeProxy.deployed()
    }).then(i => {
      return i.proposeUpgrade(ChronoBankAssetWithFee.address, params)
    }).then(() => {
      return ChronoBankAssetWithFee.deployed()
    }).then(i => {
      return i.init(ChronoBankAssetWithFeeProxy.address, params)
    }).then(() => {
      return chronoBankPlatform.changeOwnership(SYMBOL2, ContractsManager.address, params)
    }).then(() => {
      return chronoBankPlatform.changeContractOwnership(ContractsManager.address, params)
    }).then(() => {
      return contractsManager.claimPlatformOwnership(ChronoBankPlatform.address, params)
    })

    .then(() => {
      return Exchange.deployed()
    }).then(i => {
      exchange = i
      return exchange.init(ChronoBankAssetWithFeeProxy.address)
    }).then(() => {
      return exchange.changeContractOwnership(contractsManager.address, params)
    }).then(() => {
      return contractsManager.claimExchangeOwnership(Exchange.address, params)
    }).then(() => {
      return Rewards.deployed()
    }).then(i => {
      rewards = i
      return rewards.init(TimeHolder.address, 0)
    }).then(() => {
      return contractsManager.setOtherAddress(rewards.address, params)
    }).then(() => {
      return contractsManager.setOtherAddress(exchange.address, params)
    }).then(() => {
      return contractsManager.setAddress(ChronoBankAssetProxy.address, params)
    }).then(() => {
      return contractsManager.setAddress(ChronoBankAssetWithFeeProxy.address, params)
    })

    /** EXCHANGE INIT >>> */
    .then(() => {
      return contractsManager.setExchangePrices(Exchange.address, 10000000000000000, 20000000000000000)
    })
    .then(() => {
      return chronoMint.proposeLOC(
        bytes32('Bob\'s Hard Workers'),
        bytes32('www.ru'), 1000,
        bytes32('QmTeW79w7QQ6Npa3b1d5tANreCDxF2iD'),
        bytes32('aAPsDvW6KtLmfB'),
        1484554656
      )
    })
    .then(r => {
      return contractsManager.reissueAsset(SYMBOL2, 2500, r.logs[0].args._LOC, paramsGas)
    })
    .then(() => {
      return contractsManager.sendAsset(SYMBOL2, Exchange.address, 500, paramsGas)
    })
    .then(() => {
      return contractsManager.sendAsset(SYMBOL2, accounts[0], 500, paramsGas)
    })
    /** <<< EXCHANGE INIT */

    .catch(function (e) {
      console.log(e)
    })
}

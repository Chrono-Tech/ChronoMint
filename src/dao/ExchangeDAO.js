/* eslint new-cap: ["error", { "capIsNewExceptions": ["Buy", "Sell"] }] */
import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import LHTProxyDAO from './LHTProxyDAO'
import ProxyDAO from './ProxyDAO'
import ExchangeContractModel from '../models/contracts/ExchangeContractModel'

export class ExchangeDAO extends AbstractOtherContractDAO {
  static getTypeName () {
    return 'Exchange'
  }

  static getJson () {
    return require('../contracts/Exchange.json')
  }

  constructor (at = null) {
    super(ExchangeDAO.getJson(), at)
  }

  static getContractModel () {
    return ExchangeContractModel
  }

  /** @return {Promise.<ExchangeContractModel>} */
  initContractModel () {
    const Model = ExchangeDAO.getContractModel()
    return this.getAddress().then(address => new Model(address))
  }

  retrieveSettings () {
    return new Promise(resolve => {
      this.contract.then(deployed => {
        deployed.buyPrice.call().then(buyPrice => {
          deployed.sellPrice.call().then(sellPrice => {
            resolve({buyPrice: parseInt(buyPrice, 10), sellPrice: parseInt(sellPrice, 10)})
          })
        })
      })
    })
  }

  // noinspection JSCheckFunctionSignatures
  saveSettings (model: ExchangeContractModel, account: string) {
    return new Promise(resolve => {
      this.getAddress().then(address => {
        OtherContractsDAO.contract.then(contractsManager => {
          contractsManager.setExchangePrices(
            address,
            model.buyPrice(),
            model.sellPrice(),
            {from: account, gas: 3000000}
          ).then(result => resolve(result))
            .catch(e => {
              console.error(e)
              resolve(false)
            })
        })
      })
    })
  }

  getTokenSymbol () {
    return this.contract.then(deployed => deployed.asset.call())
      .then(assetAddress => new ProxyDAO(assetAddress).getSymbol())
  };

  getBuyPrice () {
    return this.contract.then(deployed => deployed.buyPrice.call())
  };

  getSellPrice () {
    return this.contract.then(deployed => deployed.sellPrice.call())
  };

  sell (amount, price, account) {
    const priceInWei = this.web3.toWei(price, 'ether')
    return this.contract.then(deployed => {
      LHTProxyDAO.approve(deployed.address, amount, account).then(() => {
        deployed.sell(amount, priceInWei, {
          from: account,
          gas: 3000000
        })
      })
    })
  };

  buy (amount, price, account) {
    const priceInWei = this.web3.toWei(price, 'ether')
    return this.contract.then(deployed =>
      deployed.buy(amount, priceInWei, {
        from: account,
        gas: 3000000,
        value: amount * priceInWei
      }))
      .catch(e => console.error(e))
  };

  watchError () {
    this.contract.then(deployed => deployed.Error().watch((e, r) => {
      if (!e) {
        console.error(this._bytesToString(r.args.message))
      } else {
        console.error(e)
      }
    }))
  };

  watchBuy (callback, account) {
    this.contract.then(deployed => {
      deployed.Buy({who: account}).watch(callback)
    })
  };

  getBuy (callback, account, filter = null) {
    this.contract.then(deployed => {
      deployed.Buy({who: account}, filter).get(callback)
    })
  };

  watchSell (callback, account) {
    this.contract.then(deployed => {
      deployed.Sell({who: account}).watch(callback)
    })
  };

  getSell (callback, account, filter = null) {
    this.contract.then(deployed => {
      deployed.Sell({who: account}, filter).get(callback)
    })
  };
}

export default new ExchangeDAO()

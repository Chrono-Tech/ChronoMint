/* eslint new-cap: ["error", { "capIsNewExceptions": ["Buy", "Sell"] }] */
import AbstractOtherContractDAO from './AbstractOtherContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import LHTProxyDAO from './LHTProxyDAO'
import AssetProxyDAO from './AssetProxyDAO'
import ExchangeContractModel from '../models/contracts/ExchangeContractModel'
import converter from '../utils/converter'
export class ExchangeDAO extends AbstractOtherContractDAO {
  static getTypeName () {
    return 'Exchange'
  }

  static getJson () {
    return require('chronobank-smart-contracts/build/contracts/Exchange.json')
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
    return Promise.all([
      this._call('buyPrice'),
      this._call('sellPrice')
    ]).then(([buyPrice, sellPrice]) => {
      return {buyPrice: parseInt(buyPrice, 10), sellPrice: parseInt(sellPrice, 10)}
    })
  }

  // noinspection JSCheckFunctionSignatures
  saveSettings (model: ExchangeContractModel) {
    return this.getAddress().then(address => {
      return OtherContractsDAO.setExchangePrices(address, model.buyPrice(), model.sellPrice())
    })
  }

  /**
   * @returns {Promise.<AssetProxyDAO>}
   */
  getAssetProxy () {
    return this._call('asset').then(address => new AssetProxyDAO(address))
  }

  getTokenSymbol () {
    return this.getAssetProxy().then(proxy => proxy.getSymbol())
  }

  getBuyPrice () {
    return this._call('buyPrice')
  }

  getSellPrice () {
    return this._call('sellPrice')
  }

  sell (amount, price) {
    amount *= 100000000
    return this.getAddress().then(address => {
      return LHTProxyDAO.approve(address, amount).then(() => {
        return this._tx('sell', [amount, converter.toWei(price)])
      })
    })
  }

  buy (amount, price) {
    const priceInWei = converter.toWei(price)
    return this._tx('buy', [amount * 100000000, priceInWei], amount * 100000000 * priceInWei)
  }

  watchError () {
    this.contract.then(deployed => deployed.Error().watch((e, r) => {
      console.log(e, r)
      if (!e) {
        console.error('ERROR')
        console.error(converter.bytesToString(r.args.message))
      } else {
        console.error('ERROR', e)
      }
    }))
  }

  watchBuy (callback, account) {
    this.contract.then(deployed => {
      deployed.Buy({who: account}).watch(callback)
    })
  }

  getBuy (callback, account, filter = null) {
    this.contract.then(deployed => {
      deployed.Buy({who: account}, filter).get(callback)
    })
  }

  watchSell (callback, account) {
    this.contract.then(deployed => {
      deployed.Sell({who: account}).watch(callback)
    })
  }

  getSell (callback, account, filter = null) {
    this.contract.then(deployed => {
      deployed.Sell({who: account}, filter).get(callback)
    })
  }
}

export default new ExchangeDAO()

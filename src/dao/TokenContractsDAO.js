import { Map } from 'immutable'
import DAORegistry from './DAORegistry'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import ExchangeDAO from './ExchangeDAO'
import LHTProxyDAO from './LHTProxyDAO'
import TokenContractModel from '../models/contracts/TokenContractModel'

export const TX_SET_ADDRESS = 'setAddress'
export const TX_CHANGE_ADDRESS = 'changeAddress'
export const TX_REMOVE_ADDRESS = 'removeAddress'

export const TX_SEND_ASSET = 'sendAsset'
export const TX_REVOKE_ASSET = 'revokeAsset'
export const TX_REISSUE_ASSET = 'reissueAsset'

export const TX_REQUIRE_TIME = 'sendTime'

export const TX_CLAIM_CONTRACT_OWNERSHIP = 'claimContractOwnership'

const TIME_INDEX = 1 // TODO Get rid of this hardcoded indexes
export const LHT_INDEX = 2

class TokenContractsDAO extends AbstractMultisigContractDAO {
  getLHTBalance () {
    return this._callNum('getBalance', [LHT_INDEX]).then(r => LHTProxyDAO.removeDecimals(r))
  }

  getContractAddressByType (type: number) {
    return this._call('getContractAddressByType', [type])
  }

  sendLHTToExchange (amount) {
    return ExchangeDAO.getAddress().then(exchangeAddress => {
      return this._tx(TX_SEND_ASSET, [LHT_INDEX, exchangeAddress, LHTProxyDAO.addDecimals(amount)], {
        asset: 'LHT',
        address: exchangeAddress,
        amount
      })
    })
  }

  requireTIME () { // only for test purposes
    return this._tx(TX_REQUIRE_TIME)
  }

  async revokeAsset (asset: string, amount: number, locAddress: string) {
    const id = asset === 'LHT' ? LHT_INDEX : TIME_INDEX
    const timeDAO = await DAORegistry.getTIMEDAO()
    const amountWithDecimals = id === LHT_INDEX ? LHTProxyDAO.addDecimals(amount) : timeDAO.addDecimals(amount)
    return this._tx(TX_REVOKE_ASSET, [id, asset, amountWithDecimals, locAddress], {
      symbol: asset,
      value: amount,
      loc: locAddress
    })
  }

  /**
   * @param asset
   * @param amount
   * @param locAddress
   * @returns {Promise.<bool>}
   */
  async reissueAsset (asset: string, amount: number, locAddress: string) {
    const id = asset === 'LHT' ? LHT_INDEX : TIME_INDEX
    const timeDAO = await DAORegistry.getTIMEDAO()
    const amountWithDecimals = id === LHT_INDEX ? LHTProxyDAO.addDecimals(amount) : timeDAO.addDecimals(amount)
    return this._tx(TX_REISSUE_ASSET, [id, asset, amountWithDecimals, locAddress], {
      symbol: asset,
      value: amount,
      loc: locAddress
    })
  }

  /** @returns {Promise.<Map[string,TokenContractModel]>} associated with token asset address */
  getList () {
    return new Promise(resolve => {
      this._call('getContracts').then(contracts => {
        let map = new Map()
        const callback = (proxyAddress, id) => {
          let contract = new TokenContractModel({proxy: proxyAddress, id})
          contract.proxy().then(proxy => {
            Promise.all([
              proxy.getLatestVersion(),
              proxy.getName(),
              proxy.getSymbol()
            ]).then(([address, name, symbol]) => {
              contract = contract.set('address', address)
              contract = contract.set('name', name)
              contract = contract.set('symbol', symbol)
              map = map.set(contract.address(), contract)
              if (map.size === contracts.length) {
                resolve(map)
              }
            })
          })
        }
        for (let j in contracts) {
          if (contracts.hasOwnProperty(j)) {
            callback(contracts[j], parseInt(j, 10) + 1)
          }
        }
        if (!contracts.length) {
          resolve(map)
        }
      })
    })
  }

  async getBalances (token: TokenContractModel, offset, length) {
    offset++
    const dao = await token.dao()
    return this._call('getAssetBalances', [token.id(), offset, length]).then(([addresses, balances]) => {
      let map = new Map()
      for (let key in addresses) {
        if (addresses.hasOwnProperty(key) && balances.hasOwnProperty(key) && !this.isEmptyAddress(addresses[key])) {
          map = map.set(addresses[key], dao.removeDecimals(balances[key].toNumber()))
        }
      }
      return map
    })
  }

  /**
   * @param proxyAddress
   * @returns {Promise.<bool>}
   * @private
   */
  _isAdded (proxyAddress) {
    return this._call('getContracts').then(contracts => {
      for (let key in contracts) {
        if (contracts.hasOwnProperty(key)) {
          if (contracts[key] === proxyAddress) {
            return true
          }
        }
      }
      return false
    })
  }

  /**
   * @param current will be removed from list
   * @param newAddress proxy or asset
   * @returns {Promise.<bool>}
   */
  treat (current: TokenContractModel, newAddress: string) {
    return new Promise((resolve, reject) => {
      if (current.address() === newAddress || current.proxyAddress() === newAddress) {
        resolve(false)
      }
      const callback = (proxyAddress) => {
        return this._isAdded(proxyAddress).then(isTokenAdded => {
          if (isTokenAdded) { // to prevent overriding of already added addresses
            return reject(new Error('token already added'))
          }
          return DAORegistry.initProxyDAO(proxyAddress).then(() => {
            return this._tx.apply(this, current.address()
              ? [TX_CHANGE_ADDRESS, [current.proxyAddress(), proxyAddress]]
              : [TX_SET_ADDRESS, [proxyAddress], current.set('address', newAddress)])
              .then(() => resolve(true))
              .catch(e => reject(e))
          }).catch(e => resolve(e))
        })
      }
      // we need to know whether the newAddress is proxy or asset
      DAORegistry.initAssetDAO(newAddress).then(asset => {
        return asset.getProxyAddress()
          .then(proxyAddress => callback(proxyAddress))
          .catch(() => callback(newAddress))
      }).catch(e => resolve(e))
    })
  }

  /**
   * @param token
   * @returns {Promise.<bool>}
   */
  remove (token: TokenContractModel) {
    return this._tx(TX_REMOVE_ADDRESS, [token.proxyAddress()], token)
  }

  /**
   * @param callback will receive TokenContractModel, timestamp, isRevoked flag and flag isOld for old events
   * @see TokenContractModel
   */
  watchUpdate (callback) {
    this.watch('UpdateContract', (result, block, time, isOld) => {
      const proxyAddress = result.args.contractAddress
      DAORegistry.initProxyDAO(proxyAddress, block).then(proxy => {
        Promise.all([
          proxy.getLatestVersion(),
          proxy.getName(),
          proxy.getSymbol()
        ]).then(([address, name, symbol]) => {
          this._isAdded(proxyAddress).then(isAdded => {
            callback(new TokenContractModel({
              id: result.args.id.toNumber(),
              address: address,
              proxy: proxyAddress,
              name,
              symbol
            }), time, !isAdded, isOld)
          })
        })
      })
    })
  }

  _decodeArgs (func, args) {
    return new Promise(resolve => {
      switch (func) {
        case TX_SET_ADDRESS:
          resolve(args) // TODO
          break
        case TX_CHANGE_ADDRESS:
          resolve(args) // TODO
          break
        case TX_REMOVE_ADDRESS:
          resolve(args) // TODO
          break

        // assets
        case TX_REVOKE_ASSET:
          resolve({
            symbol: args.symbol,
            value: args._value,
            loc: args._locAddr
          }) // TODO
          break
        case TX_REISSUE_ASSET:
          resolve({
            symbol: args.symbol,
            value: args._value,
            loc: args._locAddr
          }) // TODO
          break

        // common
        case TX_CLAIM_CONTRACT_OWNERSHIP:
          resolve({
            address: args._addr
          }) // TODO
          break

        default:
          resolve(OtherContractsDAO.decodeArgs(func, args))
      }
    })
  }
}
export default new TokenContractsDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))

import { Map } from 'immutable'
import DAOFactory from './DAOFactory'
import AbstractContractDAO from './AbstractContractDAO'
import ExchangeDAO from './ExchangeDAO'
import TokenContractModel from '../models/contracts/TokenContractModel'
import converter from '../utils/converter'

class TokenContractsDAO extends AbstractContractDAO {
  constructor (json) {
    super(json)
    this.lhtEnumIndex = 2 // TODO Probably should work through the addresses instead of indexes
  }

  getBalance (enumIndex: number) {
    return this._call('getBalance', [enumIndex]).then(r => r.toNumber() / 100000000)
  }

  getLHTBalance () {
    return this.getBalance(this.lhtEnumIndex)
  }

  sendLHTToExchange (amount) {
    return ExchangeDAO.getAddress().then(exchangeAddress => {
      return this._tx('sendAsset', ['LHT', exchangeAddress, amount * 100000000])
    })
  }

  requireTIME () { // only for test purposes
    return this._tx('sendTime')
  }

  revokeAsset (asset: string, amount: number, locAddress: string) {
    return this._tx('revokeAsset', [asset, amount * 100000000, locAddress])
  }

  /**
   * @param asset
   * @param amount
   * @param locAddress
   * @return {Promise.<bool>}
   */
  reissueAsset (asset: string, amount: number, locAddress: string) {
    return this._tx('reissueAsset', [asset, amount * 100000000, locAddress])
  }

  /** @return {Promise.<Map[string,TokenContractModel]>} associated with token asset address */
  getList () {
    return new Promise(resolve => {
      this._call('getContracts').then(contracts => {
        let map = new Map()
        const callback = (proxyAddress) => {
          let contract = new TokenContractModel({proxy: proxyAddress})
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
            callback(contracts[j])
          }
        }
        if (!contracts.length) {
          resolve(map)
        }
      })
    })
  }

  getBalances (symbol, offset, length) {
    offset++
    return this._call('getAssetBalances', [symbol, offset, length]).then(([addresses, balances]) => {
      let map = new Map()
      for (let key in addresses) {
        if (addresses.hasOwnProperty(key) && balances.hasOwnProperty(key) && !converter.isEmptyAddress(addresses[key])) {
          map = map.set(addresses[key], balances[key].toNumber() / 100000000)
        }
      }
      return map
    })
  }

  /**
   * @param proxyAddress
   * @return {Promise.<bool>}
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
   * @return {Promise.<bool>}
   */
  treat (current: TokenContractModel, newAddress: string) {
    return new Promise((resolve, reject) => {
      if (current.address() === newAddress || current.proxyAddress() === newAddress) {
        resolve(false)
      }
      const callback = (proxyAddress) => {
        this._isAdded(proxyAddress).then(isTokenAdded => {
          if (isTokenAdded) { // to prevent overriding of already added addresses
            resolve(new Error('token already added'))
            return
          }
          DAOFactory.initProxyDAO(proxyAddress).then(() => {
            this._tx.apply(this, current.address()
              ? ['changeAddress', [current.proxyAddress(), proxyAddress]]
              : ['setAddress', [proxyAddress]])
              .then(() => resolve(true))
              .catch(e => reject(e))
          }).catch(e => resolve(e))
        })
      }
      // we need to know whether the newAddress is proxy or asset
      DAOFactory.initAssetDAO(newAddress).then(asset => {
        asset.getProxyAddress()
          .then(proxyAddress => callback(proxyAddress))
          .catch(() => callback(newAddress))
      }).catch(e => resolve(e))
    })
  }

  /**
   * @param token
   * @return {Promise.<bool>}
   */
  remove (token) {
    return this._tx('removeAddress', [token.proxyAddress()])
  }

  /**
   * @param callback will receive TokenContractModel, timestamp, isRevoked flag and flag isOld for old events
   * @see TokenContractModel
   */
  watch (callback) {
    this._watch('updateContract', (result, block, time, isOld) => {
      const proxyAddress = result.args.contractAddress
      DAOFactory.initProxyDAO(proxyAddress, block).then(proxy => {
        Promise.all([
          proxy.getLatestVersion(),
          proxy.getName(),
          proxy.getSymbol()
        ]).then(([address, name, symbol]) => {
          this._isAdded(proxyAddress).then(isAdded => {
            callback(new TokenContractModel({
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
}
export default new TokenContractsDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))

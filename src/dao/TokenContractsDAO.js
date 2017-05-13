import { Map } from 'immutable'
import DAOFactory from './DAOFactory'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import ExchangeDAO from './ExchangeDAO'
import TokenContractModel from '../models/contracts/TokenContractModel'

class TokenContractsDAO extends AbstractMultisigContractDAO {
  constructor (json) {
    super(json)
    this.lhtEnumIndex = 2 // TODO Probably should work through the addresses instead of indexes
  }

  getBalance (enumIndex: number) {
    return this._callNum('getBalance', [enumIndex]).then(r => r / 100000000)
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
   * @returns {Promise.<bool>}
   */
  reissueAsset (asset: string, amount: number, locAddress: string) {
    return this._tx('reissueAsset', [asset, amount * 100000000, locAddress])
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

  getBalances (token: TokenContractModel, offset, length) {
    offset++
    return this._call('getAssetBalances', [token.id(), offset, length]).then(([addresses, balances]) => {
      let map = new Map()
      for (let key in addresses) {
        if (addresses.hasOwnProperty(key) && balances.hasOwnProperty(key) && !this._isEmptyAddress(addresses[key])) {
          map = map.set(addresses[key], balances[key].toNumber() / 100000000)
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
   * @returns {Promise.<bool>}
   */
  remove (token) {
    return this._tx('removeAddress', [token.proxyAddress()])
  }

  /**
   * @param callback will receive TokenContractModel, timestamp, isRevoked flag and flag isOld for old events
   * @see TokenContractModel
   */
  watch (callback) {
    this._watch('UpdateContract', (result, block, time, isOld) => {
      const proxyAddress = result.args.contractAddress
      DAOFactory.initProxyDAO(proxyAddress, block).then(proxy => {
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
}
export default new TokenContractsDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))

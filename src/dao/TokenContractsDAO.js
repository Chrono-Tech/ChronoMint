import { Map } from 'immutable'
import DAOFactory from './DAOFactory'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import OtherContractsDAO from './OtherContractsDAO'
import ExchangeDAO from './ExchangeDAO'
import TokenContractModel from '../models/contracts/TokenContractModel'

export const FUNC_SET_ADDRESS = 'setAddress'
export const FUNC_CHANGE_ADDRESS = 'changeAddress'
export const FUNC_REMOVE_ADDRESS = 'removeAddress'

export const FUNC_REVOKE_ASSET = 'revokeAsset'
export const FUNC_REISSUE_ASSET = 'reissueAsset'

export const FUNC_CLAIM_CONTRACT_OWNERSHIP = 'claimContractOwnership'

const TIME_INDEX = 1 // TODO Get rid of this hardcoded indexes
const LHT_INDEX = 2

class TokenContractsDAO extends AbstractMultisigContractDAO {
  getBalance (id: number) {
    return this._callNum('getBalance', [id]).then(r => r / 100000000)
  }

  getLHTBalance () {
    return this.getBalance(LHT_INDEX)
  }

  sendLHTToExchange (amount) {
    return ExchangeDAO.getAddress().then(exchangeAddress => {
      return this._tx('sendAsset', [LHT_INDEX, exchangeAddress, amount * 100000000])
    })
  }

  requireTIME () { // only for test purposes
    return this._tx('sendTime')
  }

  revokeAsset (asset: string, amount: number, locAddress: string) {
    const id = asset === 'LHT' ? LHT_INDEX : TIME_INDEX
    return this._tx(FUNC_REVOKE_ASSET, [id, asset, amount * 100000000, locAddress])
  }

  /**
   * @param asset
   * @param amount
   * @param locAddress
   * @returns {Promise.<bool>}
   */
  reissueAsset (asset: string, amount: number, locAddress: string) {
    const id = asset === 'LHT' ? LHT_INDEX : TIME_INDEX
    return this._tx(FUNC_REISSUE_ASSET, [id, asset, amount * 100000000, locAddress])
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
              ? [FUNC_CHANGE_ADDRESS, [current.proxyAddress(), proxyAddress]]
              : [FUNC_SET_ADDRESS, [proxyAddress]])
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
    return this._tx(FUNC_REMOVE_ADDRESS, [token.proxyAddress()])
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

  _decodeArgs (func, args) {
    return new Promise(resolve => {
      switch (func) {
        case FUNC_SET_ADDRESS:
          resolve(args) // TODO
          break
        case FUNC_CHANGE_ADDRESS:
          resolve(args) // TODO
          break
        case FUNC_REMOVE_ADDRESS:
          resolve(args) // TODO
          break

        // assets
        case FUNC_REVOKE_ASSET:
          resolve({
            symbol: args.symbol,
            value: args._value,
            loc: args._locAddr
          }) // TODO
          break
        case FUNC_REISSUE_ASSET:
          resolve({
            symbol: args.symbol,
            value: args._value,
            loc: args._locAddr
          }) // TODO
          break

        // common
        case FUNC_CLAIM_CONTRACT_OWNERSHIP:
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

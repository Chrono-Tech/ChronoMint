import { Map } from 'immutable'
import DAOFactory from './DAOFactory'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import AbstractOtherContractModel from '../models/contracts/AbstractOtherContractModel'
import ExchangeContractModel from '../models/contracts/ExchangeContractModel'

class OtherContractsDAO extends AbstractMultisigContractDAO {
  /**
   * @param address of contract
   * @param id
   * @param block
   * @returns {Promise.<AbstractOtherContractModel|string>} model or error
   * @private
   */
  _getModel (address: string, id: number = null, block = 'latest') {
    return new Promise((resolve, reject) => {
      const types = DAOFactory.getOtherDAOsTypes()
      let counter = 0
      const next = (e) => {
        counter++
        if (counter === types.length) {
          reject(e)
        }
      }
      const isValid = (type) => {
        this.web3.eth.getCode(address, block, (e, code) => {
          if (DAOFactory.getDAOs()[type].getJson().unlinked_binary.replace(/606060.*606060/, '606060') === code) {
            DAOFactory.initDAO(type, address, block).then(dao => {
              resolve(dao.initContractModel().then(m => m.set('id', id)))
            }).catch(e => next(new Error('init error')))
          } else {
            next(new Error('code error'))
          }
        })
      }
      for (let key in types) {
        if (types.hasOwnProperty(key)) {
          isValid(types[key])
        }
      }
    })
  }

  /** @returns {Promise.<Map[string,AbstractOtherContractModel]>} associated with contract address */
  getList () {
    return new Promise(resolve => {
      this._call('getOtherContracts').then(contracts => {
        let map = new Map()
        if (!contracts.length) {
          resolve(map)
        }
        const callback = (model: AbstractOtherContractModel) => {
          map = map.set(model.address(), model)
          if (map.size === contracts.length) {
            resolve(map)
          }
        }
        for (let j in contracts) {
          if (contracts.hasOwnProperty(j)) {
            this._getModel(contracts[j], parseInt(j, 10) + 1)
              .then(callback)
              .catch((e) => {
                console.error('skip error', e)
                return 'skip'
              })
          }
        }
      })
    })
  }

  /**
   * @param address
   * @returns {Promise}
   * @private
   */
  _isAdded (address) {
    return this._call('getOtherContracts').then(contracts => {
      for (let key in contracts) {
        if (contracts.hasOwnProperty(key)) {
          if (contracts[key] === address) {
            return true
          }
        }
      }
      return false
    })
  }

  add (address: string) {
    return new Promise((resolve, reject) => {
      this._isAdded(address).then(isAdded => {
        if (isAdded) {
          resolve(false)
          return
        }
        this._getModel(address).then(() => { // to check contract validity
          this._tx('setOtherAddress', [address])
            .then(r => resolve(true))
            .catch(e => reject(e))
        }).catch(() => resolve(false))
      })
    })
  }

  /**
   * @param contract
   * @returns {Promise}
   */
  remove (contract: AbstractOtherContractModel) {
    return this._tx('removeOtherAddress', [contract.address()])
  }

  setExchangePrices (model: ExchangeContractModel) {
    return model.dao().then(dao => {
      return dao.getData('setPrices', [model.buyPrice(), model.sellPrice()]).then(data => {
        return this._tx('forward', [model.id(), data], {
          contract: model.name(),
          address: model.address(),
          buyPrice: model.buyPrice(),
          sellPrice: model.sellPrice()
        })
      })
    })
  }

  /**
   * @param callback will receive AbstractOtherContractModel, timestamp, isRevoked flag and flag isOld for old events
   * @see AbstractOtherContractModel
   */
  watch (callback) {
    this._watch('UpdateOtherContract', (result, block, time, isOld) => {
      const address = result.args.contractAddress
      this._getModel(address, result.args.id.toNumber(), block).then((model: AbstractOtherContractModel) => {
        this._isAdded(address).then(isAdded => {
          callback(model, time, !isAdded, isOld)
        })
      }).catch(() => 'skip')
    })
  }
}

export default new OtherContractsDAO(require('chronobank-smart-contracts/build/contracts/ContractsManager.json'))

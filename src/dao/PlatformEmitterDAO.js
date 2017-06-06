import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'
import web3utils from 'web3/lib/utils/utils'
import ContractsManagerDAO from '../dao/ContractsManagerDAO'
import ERC20DAO from '../dao/ERC20DAO'

export default class PlatformEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatformEmitter.json'), at)
  }

  /**
   * @returns {Promise.<Map.<TransactionModel>>}
   */
  static prepareTxsMap (txs) {
    return new Promise((resolve) => {
      const daoPromises = txs.map((tx) => ContractsManagerDAO.getERC20DAOBySymbol(web3utils.toAscii(tx.args.symbol)))
      Promise.all(daoPromises).then((daoList) => {
        const modelPromises = daoList.map((dao: ERC20DAO, i) => dao._getTxModel(txs[i], null))

        Promise.all(modelPromises).then((values) => {
          let map = new Map()
          values.forEach(model => {
            if (model) {
              map = map.set(model.id(), model)
            }
          })
          resolve(map)
        })
      })
    })
  }
}

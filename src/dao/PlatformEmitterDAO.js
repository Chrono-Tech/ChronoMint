import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'
import ContractsManagerDAO from '../dao/ContractsManagerDAO'
import ERC20DAO from '../dao/ERC20DAO'
import Immutable from 'immutable'
import Web3Converter from '../utils/Web3Converter'

export default class PlatformEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatformEmitter.json'), at)
  }

  static async prepareTxsMap (txs: Array<Object>): Promise<Immutable.Map<string, TransactionModel>> {
    const daoPromises = txs.map((tx) => ContractsManagerDAO.getERC20DAOBySymbol(Web3Converter.bytesToString(tx.args.symbol)))
    const daoList = await Promise.all(daoPromises)

    const modelPromises = daoList.map((dao: ERC20DAO, i) => dao._getTxModel(txs[i], null))
    const transactions = await Promise.all(modelPromises)

    let map = new Immutable.Map()
    transactions.forEach(model => {
      if (model) {
        map = map.set(model.id(), model)
      }
    })
    return map
  }
}

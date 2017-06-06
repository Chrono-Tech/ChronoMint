import AbstractContractDAO from './AbstractContractDAO'
import TransactionModel from '../models/TransactionModel'
import web3utils from 'web3/lib/utils/utils'
import ContractsManagerDAO from '../dao/ContractsManagerDAO'
import ERC20DAO from '../dao/ERC20DAO'

export default class PlatformEmitterDAO extends AbstractContractDAO {
  constructor (at) {
    super(require('chronobank-smart-contracts/build/contracts/ChronoBankPlatformEmitter.json'), at)
  }

  static async prepareTxsMap (txs): Promise<Map<TransactionModel>> {
    const daoPromises = txs.map((tx) => ContractsManagerDAO.getERC20DAOBySymbol(web3utils.toAscii(tx.args.symbol)))
    const daoList = await Promise.all(daoPromises)

    const modelPromises = daoList.map((dao: ERC20DAO, i) => dao._getTxModel(txs[i], null))
    const transactions = await Promise.all(modelPromises)

    let map = new Map()
    transactions.forEach(model => {
      if (model) {
        map = map.set(model.id(), model)
      }
    })
    return map
  }
}

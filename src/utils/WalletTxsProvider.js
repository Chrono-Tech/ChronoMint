import { AbstractBlockDataProvider } from './BlockDataPaginator'
import TokenModel from '../models/TokenModel'
import ERC20DAO from '../dao/ERC20DAO'
import TransactionModel from '../models/TransactionModel'
import Immutable from 'immutable'

/**
 * For paginator
 */
export default class WalletTxsProvider extends AbstractBlockDataProvider {
  constructor () {
    super()
    this.account = null
    this.tokens = []
  }

  find (toBlock: number, fromBlock: number): Promise<Immutable.Map<string, TransactionModel>> {
    return new Promise((resolve) => {
      const tokens: Array<TokenModel> = this.tokens
      const promises = []
      tokens.forEach((token: TokenModel) => {
        const dao: ERC20DAO = token.dao()
        promises.push(dao.getTransfer(this.account, fromBlock, toBlock))
      })

      Promise.all(promises).then((all: Array<Immutable.Map<string, TransactionModel>>) => {
        let allTxs = new Immutable.Map()
        all.forEach((txs: Immutable.Map<string, TransactionModel>) => {
          allTxs = allTxs.merge(txs)
        })

        resolve(allTxs)
      })
    })
  }

  resolveID (tx: TransactionModel): string {
    return tx.id()
  }
}

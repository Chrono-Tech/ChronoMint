/**
 * For paginator
 */
import { AbstractBlockDataProvider } from './BlockDataPaginator'
import TokenModel from '../models/TokenModel'
import ERC20DAO from '../dao/ERC20DAO'
import TransactionModel from '../models/TransactionModel'
import Immutalbe from 'immutable'

export default class WalletTxsProvider extends AbstractBlockDataProvider {
  constructor () {
    super()
    this.account = null
    this.tokens = []
  }

  find (toBlock: number, fromBlock: number): Promise<Array<Object>> {
    return new Promise((resolve) => {
      const tokens: Array<TokenModel> = this.tokens
      const promises = []
      tokens.forEach((token: TokenModel) => {
        const dao: ERC20DAO = token.dao()
        promises.push(dao.getTransfer(this.account, fromBlock, toBlock))
      })

      Promise.all(promises).then((all: Array<Immutalbe.Map<string, TransactionModel>>) => {
        let allTxs = new Immutalbe.Map()
        all.forEach((txs: Immutalbe.Map<string, TransactionModel>) => {
          allTxs = allTxs.merge(txs)
        })

        resolve(allTxs.toArray()) // TODO @sashaaro make paginator work with Immutable
      })
    })
  }

  resolveID (tx: TransactionModel): string {
    return tx.id()
  }
}

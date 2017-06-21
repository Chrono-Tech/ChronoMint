import AbstractTokenDAO from './AbstractTokenDAO'
import AbstractContractDAO from './AbstractContractDAO'

import TransactionModel from '../models/TransactionModel'
import TransactionExecModel from '../models/TransactionExecModel'
import TransferNoticeModel from '../models/notices/TransferNoticeModel'

import ls from '../utils/LocalStorage'

class EthereumDAO extends AbstractTokenDAO {
  getAccountBalance (account) {
    return this._web3Provider.getBalance(account).then(balance => {
      return this._c.fromWei(balance.toNumber())
    })
  }

  isInitialized () {
    return true
  }

  getDecimals () {
    return 18
  }

  addDecimals (amount: number) {
    return amount
  }

  removeDecimals (amount: number) {
    return amount
  }

  getSymbol () {
    return 'ETH'
  }

  getName () {
    return this.getSymbol()
  }

  /**
   * @param tx
   * @param account
   * @param time
   * @returns {TransactionModel}
   * @private
   */
  _getTxModel (tx, account, time = Date.now() / 1000) {
    return new TransactionModel({
      txHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      transactionIndex: tx.transactionIndex,
      from: tx.from,
      to: tx.to,
      value: this._c.fromWei(tx.value.toNumber()),
      time,
      gasPrice: tx.gasPrice,
      gas: tx.gas,
      input: tx.input,
      credited: tx.to === account,
      symbol: this.getSymbol()
    })
  }

  /**
   * @param amount
   * @param recipient
   * @returns {Promise<TransferNoticeModel>}
   */
  transfer (amount, recipient) {
    const txData = {
      from: ls.getAccount(),
      to: recipient,
      value: this._c.toWei(parseFloat(amount, 10))
    }
    const tx = new TransactionExecModel({
      contract: 'Ethereum',
      func: 'transfer',
      value: amount,
      args: {
        from: ls.getAccount(),
        to: recipient,
        value: amount,
        currency: this.getSymbol()
      }
    })

    return new Promise(async (resolve) => {
      try {
        const isConfirmed = await AbstractContractDAO.txStart(tx)
        if (!isConfirmed) {
          return
        }

        const txHash = await this._web3Provider.sendTransaction(txData)
        const web3 = await this._web3Provider.getWeb3()
        let filter = web3.eth.filter('latest', async (e, blockHash) => {
          if (!filter) {
            return
          }
          const block = await this._web3Provider.getBlock(blockHash)
          const txs = block.transactions || []
          if (!txs.includes(txHash)) {
            return
          }
          const txData = await this._web3Provider.getTransaction(txHash)
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(txData, ls.getAccount()),
            account: ls.getAccount()
          }), false)

          AbstractContractDAO.removeFilterEvent(filter)
          filter.stopWatching(() => {})
          filter = null
          resolve(true)
        }, (e) => {
          // new callback since web3 0.19
          console.error('--EthereumDAO#', e)
        })
        AbstractContractDAO.addFilterEvent(filter)
      } catch (e) {
        AbstractContractDAO.txEnd(tx.id(), e)
        throw new Error(e)
      }
    })
  }

  /** @inheritDoc */
  async watchTransfer (callback) {
    this._transferCallback = callback
    const web3 = await this._web3Provider.getWeb3()
    const filter = web3.eth.filter('latest')
    AbstractContractDAO.addFilterEvent(filter)
    filter.watch(async (e, r) => {
      if (e) {
        return
      }
      const block = await this._web3Provider.getBlock(r, true)
      const txs = block.transactions || []
      txs.forEach(tx => {
        if (tx.value.toNumber() > 0 && (tx.from === ls.getAccount() || tx.to === ls.getAccount())) {
          this._transferCallback(new TransferNoticeModel({
            tx: this._getTxModel(tx, ls.getAccount()),
            account: ls.getAccount()
          }), false)
        }
      })
    })
  }

  getTransfer (account, id) {
    // TODO @bshevchenko: currently disabled, use Etherscan API
    return []
    // const callback = async (block) => {
    //   let map = new Immutable.Map()
    //   try {
    //     block = await this._web3Provider.getBlock(block, true)
    //   } catch (e) {
    //     console.error(e)
    //     return map
    //   }
    //   const txs = block.transactions || []
    //   txs.forEach(tx => {
    //     if ((tx.to === account || tx.from === account) && tx.value > 0) {
    //       const txModel: TransactionModel = this._getTxModel(tx, account, block.timestamp)
    //       map = map.set(txModel.id(), txModel)
    //     }
    //   })
    //   return map
    // }
    // const promises = []
    // let map = new Immutable.Map()
    // for (let i = 1; i <= 0; i++) {
    //   promises.push(callback(i))
    // }
    // return new Promise(resolve => {
    //   Promise.all(promises).then(values => {
    //     values.forEach(txs => {
    //       map = map.merge(txs)
    //     })
    //     resolve(map)
    //   })
    // })
  }
}

export default new EthereumDAO()

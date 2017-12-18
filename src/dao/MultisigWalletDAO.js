import TxExecModel from '@/models/TxExecModel'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractMultisigContractDAO from 'dao/AbstractMultisigContractDAO'
import TokenModel from 'models/tokens/TokenModel'
import MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import MultisigWalletPendingTxCollection from 'models/wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import tokenService from 'services/TokenService'
import { MultiEventsHistoryABI, WalletABI } from './abi'

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (at) {
    super(WalletABI, at, MultiEventsHistoryABI)
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
  }

  watchConfirmationNeeded (wallet, callback) {
    return this._watch('MultisigWalletConfirmationNeeded', (result) => {
      const { operation, initiator, value, to, data } = result.args

      console.log('--MultisigWalletDAO#', result, initiator, data)

      // TODO @dkchv: !!!!
      callback(new MultisigWalletPendingTxModel({
        id: operation,
        value,
        to,
        isConfirmed: initiator === this.getAccount(),
        data,
      }))
    }, { self: wallet.address() })
  }

  watchMultiTransact (wallet, callback) {
    return this._watch('MultisigWalletMultiTransact', (result) => {
      const { self, owner, operation, value, to, data } = result.args

      console.log('--MultisigWalletDAO#', data)

      callback(new MultisigTransactionModel({
        id: operation,
        owner,
        wallet: wallet.address(),
        value,
        to,
        data,
      }))
    }, { self: wallet.address() })
  }

  watchSingleTransact (wallet, callback) {
    return this._watch('MultisigWalletSingleTransact', callback, { self: wallet.address() })
  }

  watchDeposit (wallet, callback) {
    return this._watch('MultisigWalletDeposit', (result) => {
      callback(wallet.tokens().get('ETH').dao().removeDecimals(result.args.value))
    }, { self: wallet.address() })
  }

  watchRevoke (wallet, callback) {
    return this._watch('MultisigWalletRevoke', (result) => {
      callback(result.args.operation)
    }, { self: wallet.address() })
  }

  watchConfirmation (wallet, callback) {
    return this._watch('MultisigWalletConfirmation', (result) => {
      // TODO @dkchv: something wrong with contract
      if (result.args.owner === '0x') {
        return
      }
      callback(result.args.operation, result.args.owner)
    }, { self: wallet.address() })
  }

  watchOwnerAdded (wallet, callback) {
    return this._watch('MultisigWalletOwnerAdded', (result) => {
      callback(result.args.newOwner)
    }, { self: wallet.address() })
  }

  watchOwnerRemoved (wallet, callback) {
    return this._watch('MultisigWalletOwnerRemoved', (result) => {
      // TODO @dkchv: if its me - remove wallet!
      callback(result.args.oldOwner)
    }, { self: wallet.address() })
  }

  watchError (wallet, callback) {
    return this._watch('Error', (result) => {
      console.log('--MultisigWalletDAO#', result)
      callback(this._c.hexToDecimal(result.args.errorCode))
      // callback(result.args.errorCode)
    }, { self: wallet.address() })
  }

  async getPendings () {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const [ values, operations, isConfirmed ] = await this._call('getPendings')

    operations.forEach((id, i) => {
      let pendingTxModel
      pendingTxModel = new MultisigWalletPendingTxModel({
        id,
        // TODO @dkchv: remove decimal
        value: values [i],
        isConfirmed: isConfirmed[ i ],
      })
      pendingTxCollection = pendingTxCollection.add(pendingTxModel)
    })
    return pendingTxCollection
  }

  async getOwners () {
    const counter = await this._callNum('m_numOwners')
    let promises = []
    for (let i = 0; i < counter; i++) {
      promises.push(this._call('getOwner', [ i ]))
    }
    return Promise.all(promises)
  }

  getRequired () {
    return this._callNum('m_required')
  }

  async removeWallet (wallet, account: string) {
    const result = await this._tx('kill', [
      account,
    ], {
      address: wallet.address(),
      account,
    })
    return result.tx
  }

  async addOwner (wallet, ownerAddress) {
    const result = await this._tx('addOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
    })
    return result.tx
  }

  async removeOwner (wallet, ownerAddress) {
    const result = await this._tx('removeOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
    })
    return result.tx
  }

  async transfer (wallet: MultisigWalletModel, token: TokenModel, amount, to) {
    const tokenDAO = tokenService.getDAO(token.id())
    const value = tokenDAO.addDecimals(amount)
    const result = await this._tx('transfer', [
      to,
      value,
      token.symbol(),
    ], {
      from: wallet.address(),
      to,
      symbol: token.symbol(),
      amount,
    })
    return result.tx
  }

  async confirmPendingTx (tx) {
    const result = await this._tx('confirm', [
      tx.id(),
    ])
    return result.tx
  }

  async revokePendingTx (tx) {
    const result = await this._tx('revoke', [
      tx.id(),
    ], tx.txRevokeSummary())
    return result.tx
  }

  async getPendingData (pending: MultisigWalletPendingTxModel) {
    const data = await this._call('getData', [pending.id()])
    const result: TxExecModel = await this.decodeData(data)
    console.log('--MultisigWalletDAO#getPendingData', result.toJS())


    // TODO @dkchv: continue here!!!


  }

  async _decodeArgs (func, args) {

    const symbol = this._c.bytesToString(args._symbol)
    const tokenDAO = tokenService.getDAO(symbol)
    console.log('--MultisigWalletDAO#_decodeArgs', symbol, tokenDAO)

    switch (func) {
      case 'transfer':
        return {
          symbol,
          value: tokenDAO.removeDecimals(args._value),
          to: args._to,
        }
    }
    console.log('--MultisigWalletDAO#_decodeArgs', func, args)
  }
}

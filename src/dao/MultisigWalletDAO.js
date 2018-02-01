import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractMultisigContractDAO from 'dao/AbstractMultisigContractDAO'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import TxExecModel from 'models/TxExecModel'
import MultisigTransactionModel from 'models/wallet/MultisigTransactionModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import MultisigWalletPendingTxCollection from 'models/wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from 'models/wallet/OwnerModel'
import { MultiEventsHistoryABI, WalletABI } from './abi'

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (at) {
    super(WalletABI, at, MultiEventsHistoryABI)
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
  }

  // watchers

  _transactCallback = (wallet, callback) => async (result) => {
    const { owner, operation, value, to, data } = result.args

    callback(new MultisigTransactionModel({
      id: operation,
      owner,
      wallet: wallet.address(),
      value,
      to,
      data: await this.decodeData(data),
    }))
  }

  watchMultiTransact (wallet, callback) {
    return this._watch(
      'MultisigWalletMultiTransact',
      this._transactCallback(wallet, callback),
      { self: wallet.address() },
    )
  }

  watchSingleTransact (wallet, callback) {
    return this._watch(
      'MultisigWalletSingleTransact',
      this._transactCallback(wallet, callback),
      { self: wallet.address() },
    )
  }

  watchDeposit (wallet, callback) {
    return this._watch('MultisigWalletDeposit', (result) => {
      callback(result.args.value)
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

  watchConfirmationNeeded (wallet, callback) {
    return this._watch('MultisigWalletConfirmationNeeded', async (result) => {
      const { operation, initiator, value, to, data } = result.args

      callback(new MultisigWalletPendingTxModel({
        id: operation,
        value,
        to,
        isConfirmed: initiator === this.getAccount(),
        decodedTx: await this.decodeData(data),
      }))
    }, { self: wallet.address() })
  }

  watchOwnerAdded (wallet, callback) {
    return this._watch('MultisigWalletOwnerAdded', (result) => {
      callback(new OwnerModel({
        address: result.args.newOwner,
      }))
    }, { self: wallet.address() })
  }

  watchOwnerRemoved (wallet, callback) {
    return this._watch('MultisigWalletOwnerRemoved', (result) => {
      // TODO @dkchv: if its me - remove wallet!
      callback(new OwnerModel({
        address: result.args.oldOwner,
      }))
    }, { self: wallet.address() })
  }

  watchError (wallet, callback) {
    return this._watch('Error', (result) => {
      console.log('--MultisigWalletDAO#', result)
      callback(this._c.hexToDecimal(result.args.errorCode))
    }, { self: wallet.address() })
  }

  watchRequirementChanged (wallet, callback) {
    return this._watch('MultisigWalletRequirementChanged', (result) => {
      callback(+result.args.newRequirement)
    }, { self: wallet.address() })
  }

  // getters

  async getPendings () {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const [ values, operations, isConfirmed ] = await this._call('getPendings')

    operations.filter(this.isValidId).forEach((id, i) => {
      let pendingTxModel
      pendingTxModel = new MultisigWalletPendingTxModel({
        id,
        value: values [ i ],
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

  async getPendingData (id: string): Promise<TxExecModel> {
    const data = await this._call('getData', [ id ])
    return this.decodeData(data)
  }

  getReleaseTime (): Promise {
    return this._callDate('releaseTime')
  }

  // actions

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

  async transfer (wallet: MultisigWalletModel, token: TokenModel, amount, to/*, feeMultiplier: Number = 1*/) {
    // const tokenDAO = tokenService.getDAO(token.id())
    // const value = tokenDAO.addDecimals(amount)
    const result = await this._tx('transfer', [
      to,
      new BigNumber(amount),
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

  async changeRequirement (newRequired: Number) {
    const result = await this._tx('changeRequirement', [
      newRequired,
    ], {
      signatureRequirements: newRequired,
    })
    return result.tx
  }

  // helpers

  isValidId (id) {
    return id !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  }

  async _decodeArgs (func: string, args: Object) {
    console.log('--MultisigWalletDAO#_decodeArgs', func, args)
    switch (func) {
      case 'transfer':
        const symbol = this._c.bytesToString(args._symbol)
        return {
          symbol,
          value: new Amount(args._value, symbol),
          to: args._to,
        }
      case 'changeRequirement':
        return {
          requiredSignatures: args._newRequired.toNumber(),
        }
      case 'addOwner':
        return {
          owner: args._owner,
        }
      case 'removeOwner':
        return {
          owner: args._owner,
        }
      case 'kill':
        return {
          to: args._to,
        }
      default:
        console.warn('warn: decoder not implemented for function: ', func)
        return args
    }
  }
}

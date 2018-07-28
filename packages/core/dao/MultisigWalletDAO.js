/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxExecModel from '../models/TxExecModel'
import MultisigTransactionModel from '../models/wallet/MultisigTransactionModel'
import MultisigWalletPendingTxCollection from '../models/wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from '../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../models/wallet/OwnerModel'
import { MultiEventsHistoryABI, WalletABI } from './abi'
import MultisigEthWalletModel from '../models/wallet/MultisigEthWalletModel'

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (at) {
    super({ address: at, history: MultiEventsHistoryABI, abi: WalletABI })
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
    const res = await this.contract.methods.getPendings().call()
    const [values, operations, isConfirmed] = Object.values(res)

    let promises = []
    operations.map((operation) => {
      promises.push(ethereumProvider.checkConfirm2FAtx(operation))
    })
    const verifiedOperations = await Promise.all(promises)

    operations.filter(this.isValidId).forEach((id, i) => {
      let pendingTxModel
      pendingTxModel = new MultisigWalletPendingTxModel({
        id,
        value: values [i],
        isConfirmed: isConfirmed[i],
        isPending: verifiedOperations[i] ? verifiedOperations[i].activated : false,
      })
      pendingTxCollection = pendingTxCollection.add(pendingTxModel)
    })
    return pendingTxCollection
  }

  async getOwners () {
    const counter = await this.contract.methods.m_numOwners().call()
    let promises = []
    for (let i = 0; i < counter; i++) {
      promises.push(this.contract.methods.getOwner(i).call())
    }
    return Promise.all(promises)
  }

  getRequired () {
    return this.contract.methods.m_required().call()
  }

  async getPendingData (id: string): Promise<TxExecModel> {
    const data = await this._call('getData', [id])
    return this.decodeData(data)
  }

  async getReleaseTime () {
    return this.contract.methods.releaseTime().call()
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

  async transfer (wallet: MultisigEthWalletModel, token: TokenModel, amount, to, feeMultiplier: Number = 1, value) {
    // const tokenDAO = tokenService.getDAO(token.id())
    // const value = tokenDAO.addDecimals(amount)
    /*
    func: string,
    args: Array = [],
    amount: BigNumber = new BigNumber(0),
    value: BigNumber = new BigNumber(0),
    options: Object = {},
    additionalOptions: Object = {},
    */

    await this._tx('transfer',
      [
        to,
        new BigNumber(amount),
        this.web3.utils.asciiToHex(token.symbol()),
      ],
      new BigNumber(0),
      new BigNumber(0),
      {},
      value)
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

  use2FA () {
    return this._call('use2FA')
  }
}

/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { zipWith } from 'lodash'
import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import AbstractContractDAO from './AbstractContractDAO'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxExecModel from '../models/TxExecModel'
import MultisigTransactionModel from '../models/wallet/MultisigTransactionModel'
import MultisigWalletPendingTxModel from '../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../models/wallet/OwnerModel'
import { WalletABI } from './abi'
import MultisigEthWalletModel from '../models/wallet/MultisigEthWalletModel'
import web3Converter from '../utils/Web3Converter'

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (address, history) {
    super({ address, history, abi: WalletABI })
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
  }

  // watchers
  _transactCallback = (callback) => async (result) => {
    const { owner, operation, value, to, data } = result.args

    callback(new MultisigTransactionModel({
      id: operation,
      owner,
      wallet: this.address,
      value,
      to,
      data: await this.decodeData(data),
    }))
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleAllEventsData)

  }

  handleAllEventsData = (data) => {
    if (!data || !data.event) {
      return
    }

    this.emit(data.event, data)
  }

  watchMultiTransact (callback) {
    return this.on('MultisigWalletMultiTransact', this._transactCallback(callback))
  }

  watchSingleTransact (callback) {
    return this.on('MultisigWalletSingleTransact', this._transactCallback(callback))
  }

  watchDeposit (callback) {
    return this.on('MultisigWalletDeposit', (data) => callback(data.returnValues.value))
  }

  watchRevoke (callback) {
    return this.on('MultisigWalletRevoke', (data) => callback(data.returnValues.operation.toLowerCase()))
  }

  watchConfirmation (callback) {
    return this.on('MultisigWalletConfirmation', (data) => {
      // TODO @dkchv: something wrong with contract
      if (data.returnValues.owner === '0x') {
        return
      }
      callback(data.returnValues.operation.toLowerCase(), data.returnValues.owner.toLowerCase())
    })
  }

  watchConfirmationNeeded (callback) {
    return this.on('MultisigWalletConfirmationNeeded', async (tx) => {
      const { operation, initiator, value, to } = tx.returnValues
      callback(new MultisigWalletPendingTxModel({
        id: operation.toLowerCase(),
        value,
        to: to.toLowerCase(),
        isConfirmed: initiator === AbstractContractDAO.getAccount(),
        decodedTx: await this.decodeData(tx.raw.data),
      }))
    })
  }

  watchOwnerAdded (callback) {
    return this.on('MultisigWalletOwnerAdded', async (data) => {
      callback(new OwnerModel({
        address: data.returnValues.newOwner.toLowerCase(),
      }))
    })
  }

  watchOwnerRemoved (callback) {
    return this.on('MultisigWalletOwnerRemoved', async (data) => {
      // TODO @dkchv: if its me - remove wallet!
      callback(new OwnerModel({
        address: data.returnValues.oldOwner.toLowerCase(),
      }))
    })
  }

  watchError (callback) {
    return this.on('Error', async (data) => {
      callback(data.returnValues.errorCode)
    })
  }

  watchRequirementChanged (callback) {
    return this.on('MultisigWalletRequirementChanged', async (data) => {
      callback(+data.returnValues.newRequirement.toLowerCase())
    })
  }

  // getters
  async getPendings () {
    try {
      const pendingTxCollection = {}
      const res = await this.contract.methods.getPendings().call()
      const [values, operations, isConfirmed] = Object.values(res)
      const txs = zipWith(
        values, operations, isConfirmed,
        (value, address, isConfirmed) => ({
          value,
          address,
          isConfirmed,
        }))
        .filter((operation) => this.isValidId(operation.address))

      const pendingData = await Promise.all(txs
        .map((operation) => this.getPendingData(operation.address)))

      txs.forEach((operation, i) => {
        const pendingTxModel = new MultisigWalletPendingTxModel({
          id: operation.address,
          value: new BigNumber(operation.value),
          isConfirmed: operation.isConfirmed,
          isPending: false,
          decodedTx: pendingData[i] ? pendingData[i] : null,
        })
        pendingTxCollection[pendingTxModel.id] = pendingTxModel
      })

      return pendingTxCollection
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
      return Promise.resolve({})
    }
  }

  async getOwners () {
    try {
      const counter = await this.contract.methods.m_numOwners().call()
      const promises = []
      for (let i = 0; i < counter; i++) {
        promises.push(this.contract.methods.getOwner(i).call())
      }
      return Promise.all(promises)
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
      return Promise.resolve([])
    }
  }

  getRequired () {
    try {
      return this.contract.methods.m_required().call()
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
      return Promise.resolve(0)
    }
  }

  async getPendingData (id: string): Promise<TxExecModel> {
    const data = await this.contract.methods.getData(id).call()
    return this.decodeData(data)
  }

  async getReleaseTime () {
    try {
      return this.contract.methods.releaseTime().call()
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
      return Promise.resolve(0)
    }
  }

  // actions
  removeWallet (account: string) {
    return this._tx('kill', [account])
  }

  addOwner (wallet, ownerAddress) {
    return this._tx('addOwner', [ownerAddress])
  }

  removeOwner (wallet, ownerAddress) {
    return this._tx('removeOwner', [ownerAddress])
  }

  transfer (wallet: MultisigEthWalletModel, token: TokenModel, amount, to, value) {
    return this._tx(
      'transfer',
      [
        to,
        new BigNumber(amount),
        this.web3.utils.asciiToHex(token.symbol()),
      ],
      value,
    )
  }

  confirmPendingTx (tx) {
    return this._tx('confirm', [tx.id])
  }

  revokePendingTx (tx) {
    return this._tx('revoke', [tx.id])
  }

  changeRequirement (newRequired: number) {
    return this._tx('changeRequirement', [newRequired])
  }

  // helpers
  isValidId (id) {
    return id !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  }

  async _decodeArgs (func: string, args: Object) {
    switch (func) {
      case 'transfer': {
        const symbol = web3Converter.bytesToString(args._symbol)
        return {
          symbol,
          value: new Amount(args._value, symbol),
          to: args._to,
        }
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
        // eslint-disable-next-line
        console.warn('warn: decoder not implemented for function: ', func)
        return args
    }
  }

  use2FA () {
    return this.contract.methods.use2FA().call()
  }
}

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import type TxModel from '../models/TxModel'
import { address } from '../models/validator'
import AbstractContractDAO from './AbstractContractDAO'

export const EVENT_NEW_TRANSFER = 'TokenTxTransfer'
export const EVENT_UPDATE_BALANCE = 'TokenUpdateBalance'
export const EVENT_UPDATE_LAST_BLOCK = 'updateLastBlock'
export const FETCH_NEW_BALANCE = 'TokenFetchNewBalance'
export const EVENT_MODIFY_BALANCE = 'TokenModifyBalance'
export const EVENT_APPROVAL_TRANSFER = 'TokenApprovalTransfer'

export default class AbstractTokenDAO extends AbstractContractDAO {
  constructor (json, at) {
    if (new.target === AbstractTokenDAO) {
      throw new TypeError('Cannot construct AbstractTokenDAO instance directly')
    }
    super(json, at)
  }

  // eslint-disable-next-line no-unused-vars
  getAccountBalance (account): Promise {
    throw new Error('should be overridden')
  }

  getAddressValidator () {
    return address
  }

  isInitialized () {
    throw new Error('should be overridden')
  }

  hasBalancesStream () {
    // Balance should be fetched after transfer notification
    return false
  }

  addDecimals (amount: Amount): Amount {
    return amount
  }

  removeDecimals (amount: Amount): Amount {
    return amount
  }

  /**
   * @abstract
   */
  getSymbol () {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  transfer (from: string, to: string, amount: Amount, token: TokenModel, fee): Promise {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line no-unused-vars
  getTransfer (id, account): Promise<Array<TxModel>> {
    throw new Error('should be overridden')
  }

  /**
   * @param callback will receive...
   * @see TransferNoticeModel with...
   * @see TxModel
   */
  // eslint-disable-next-line no-unused-vars
  watchTransfer (account, callback) {
    throw new Error('should be overridden')
  }

  // eslint-disable-next-line
  watchApproval (callback) {
    // no code for EthereumDAO
  }
}

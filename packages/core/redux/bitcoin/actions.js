/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { SignerMemoryModel, TxEntryModel, TxExecModel } from '../../models'
import { pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM, NONCE_UPDATE, TX_CREATE, TX_STATUS, WEB3_UPDATE } from './constants'
import { getSigner } from '../persistAccount/selectors'
import TokenModel from "../../models/tokens/TokenModel";
import TransferExecModel from "../../models/TransferExecModel";
import Amount from "../../models/Amount";


export const submit = (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1, advancedParams) => (dispatch, getState) => {
  const tokenFeeRate = advancedParams && advancedParams.satPerByte ? advancedParams.satPerByte : token.feeRate()
  setImmediate(async () => {
    const fee = await dispatch(estimateFee(from, to, amount, tokenFeeRate)) // use feeMultiplier = 1 to estimate default fee
    this.emit('submit', new TransferExecModel({
      title: `tx.Bitcoin.${this._name}.transfer.title`,
      from,
      to,
      amount: new Amount(amount, token.symbol()),
      amountToken: token,
      fee: new Amount(fee, token.symbol()),
      feeToken: token,
      feeMultiplier,
      options: {
        advancedParams,
      },
    }))
  })
}

export const estimateFee = (from: string, to, amount: BigNumber, feeRate: Number) => async (dispatch, getState) => {
  const node = this._selectNode(this._engine)
  const utxos = await node.getAddressUTXOS(from || this._engine.getAddress())
  const { fee } = this._engine.describeTransaction(to, amount, feeRate, utxos)
  return fee
}

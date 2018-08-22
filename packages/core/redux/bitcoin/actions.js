/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { SignerMemoryModel, TxEntryModel, TxExecModel } from '../../models'
import { pendingEntrySelector, web3Selector } from './selectors'
import { DUCK_ETHEREUM, NONCE_UPDATE, TX_CREATE, TX_STATUS, WEB3_UPDATE } from './constants'
import { getSigner } from '../persistAccount/selectors'
import TokenModel from "../../models/tokens/TokenModel";
import TransferExecModel from "../../models/TransferExecModel";
import Amount from "../../models/Amount";
import { nextNonce, sendSignedTransaction, signTransaction } from "../ethereum/actions";
import { BLOCKCHAIN_ETHEREUM } from "../../dao/constants";
import { showConfirmTransferModal } from "../../../core-dependencies/redux/ui/actions";
import { notifyError } from "../notifier/actions";

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

export const createTransaction = (entry) => ({
  type: TX_CREATE,
  entry
})

export const executeTransaction = ({ tx, options }) => async (dispatch, getState) => {
  const entry = new TxEntryModel({
    key: uuid(),
    tx: tx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
  })

  dispatch(createTransaction(entry))

  dispatch(submitTransaction(entry))
}

const submitTransaction = (entry) => async (dispatch) => {
  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      accept: acceptTransaction,
      reject: rejectTransaction,
    },
  }))
}

const acceptTransaction = (tx) => async (dispatch, getState) => {
  const txOptions = tx.options()

  const tokenRate = advancedParams && advancedParams.satPerByte ? advancedParams.satPerByte : feeMultiplier * token.feeRate()

  return await this._bitcoinProvider.transfer(tx.from(), tx.to(), tx.amount(), tokenRate)
}

export const processTransaction = ({ web3, entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    web3,
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isRejected: true,
    },
  })
}

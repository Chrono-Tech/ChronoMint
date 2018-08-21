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
import { nextNonce, processTransaction } from "../ethereum/actions";
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

export const prepareTransaction = ({ web3, tx, options }) => async (dispatch) => {
  const { feeMultiplier } = options || {}
  const nonce = await dispatch(nextNonce({ web3, address: tx.from }))
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).mul(feeMultiplier || 1)
  const chainId = await web3.eth.net.getId()

  const gasLimit = await web3.eth.estimateGas({
    from: tx.from,
    to: tx.to,
    gasPrice,
    value: tx.value,
    data: tx.data,
    nonce,
    chainId,
  })

  return new TxExecModel({
    ...tx,
    hash: null,
    data: tx.data != null
      ? tx.data
      : null,
    block: null,
    from: tx.from.toLowerCase(),
    to: tx.to.toLowerCase(),
    gasLimit: new BigNumber(gasLimit),
    gasPrice,
    nonce,
    chainId,
  })
}

export const executeTransaction = ({ tx, options }) => async (dispatch, getState) => {
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = new TxEntryModel({
    key: uuid(),
    tx: prepared,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
  })

  await dispatch({ type: TX_CREATE, entry })

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

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch({
    type: TX_STATUS,
    key: entry.key,
    address: entry.tx.from,
    props: {
      isAccepted: true,
      isPending: true,
    },
  })
  const state = getState()
  let signer = getSigner(state)
  if (entry.walletDerivedPath) {
    signer = await SignerMemoryModel.fromDerivedPath({ seed: signer.privateKey, derivedPath: entry.walletDerivedPath })
  }

  return dispatch(processTransaction({
    web3: web3Selector()(state),
    entry: pendingEntrySelector(entry.tx.from, entry.key)(state),
    signer,
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

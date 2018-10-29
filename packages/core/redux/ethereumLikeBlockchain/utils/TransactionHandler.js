/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import autobind from 'autobind-decorator'
import BigNumber from 'bignumber.js'
import { isNil, omitBy } from 'lodash'
import uuid from 'uuid/v1'

import { describePendingTx } from '../../../describers'
import { TxEntryModel, TxExecModel } from '../../../models'
import { modalsOpen } from '../../modals/actions'
import { showSignerModal, closeSignerModal } from '../../modals/thunks'
import { DUCK_PERSIST_ACCOUNT } from '../../persistAccount/constants'
import { getAccount } from '../../session/selectors/models'
import TransactionGuide from './TransactionGuide'

export default class TransactionHandler extends TransactionGuide {
  constructor (duckId, pendingSelector, pendingEntrySelector, getSigner, getDerivedWallet, actions) {
    super(duckId)
    this.pendingSelector = pendingSelector
    this.pendingEntrySelector = pendingEntrySelector
    this.getSigner = getSigner
    this.getDerivedWallet = getDerivedWallet
    this.actions = actions
  }

  @autobind
  executeTransaction ({ tx, options }) {
    return (
      async (dispatch, getState) => {
        const web3 = this.getWeb3(getState())
        const prepared = await dispatch(this.prepareTransaction({ web3, tx, options }))
        const entry = createTxEntryModel(prepared, options)

        await dispatch(this.actions.txCreate(entry))
        dispatch(this.submitTransaction(entry))
      }
    )
  }

  @autobind
  acceptTransaction (entry) {
    return (
      async (dispatch, getState) => {
        dispatch(this.txStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

        const state = getState()
        let signer = this.getSigner(state)

        if (entry.walletDerivedPath) {
          signer = await this.getDerivedWallet(signer.privateKey, entry.walletDerivedPath)
        }

        return dispatch(this.processTransaction({
          web3: this.getWeb3(state),
          entry: this.pendingEntrySelector(entry.tx.from, entry.key)(state),
          signer,
        }))
      }
    )
  }

  @autobind
  txStatus (key, address, props) {
    return (
      (dispatch, getState) => {
        const pending = this.pendingSelector()(getState())
        const scope = pending[address]

        if (!scope) {
          return null
        }

        const entry = scope[key]

        if (!entry) {
          return null
        }

        return dispatch(this.actions.txUpdate(
          key,
          address,
          new TxEntryModel({
            ...entry,
            ...props,
          }),
        ))
      }
    )
  }

  @autobind
  processTransaction ({ web3, entry, signer }) {
    return (
      async (dispatch, getState) => {
        await dispatch(this.signTransaction({ entry, signer }))
        return dispatch(this.sendSignedTransaction({
          web3,
          entry: this.pendingEntrySelector(entry.tx.from, entry.key)(getState()),
        }))
      }
    )
  }

  @autobind
  submitTransaction (entry) {
    return (
      async (dispatch, getState) => {
        const state = getState()
        const account = getAccount(state)
        const dao = this.getDAO(entry, state)

        const description = describePendingTx(entry, dao.getSymbol(), {
          address: account,
          abi: dao.abi,
          token: dao.token,
        })

        dispatch(modalsOpen({
          componentName: 'ConfirmTxDialog',
          props: {
            entry,
            description,
            accept: this.acceptTransaction,
            reject: () => dispatch(this.txStatus(entry.key, entry.tx.from, { isRejected: true })),
          },
        }))
      }
    )
  }

  @autobind
  prepareTransaction ({ web3, tx, options }) {
    return (
      async (dispatch) => {
        const { feeMultiplier } = options || {}
        const { chainId, gasLimit, gasPrice, nonce } = await this.getGasData(dispatch, web3, tx, feeMultiplier)
        return createTxExecModel(tx, gasLimit, gasPrice, nonce, chainId)
      }
    )
  }

  @autobind
  sendSignedTransaction ({ web3, entry }) {
    return (
      async (dispatch, getState) => {
        dispatch(this.txStatus(entry.key, entry.tx.from, { isPending: true }))
        entry = this.pendingEntrySelector(entry.tx.from, entry.key)(getState())
        dispatch(this.actions.nonceUpdate(entry.tx.from, entry.tx.nonce))

        return new Promise((resolve, reject) => {
          web3.eth.sendSignedTransaction(entry.raw)
            .on('transactionHash', (hash) => {
              dispatch(this.txStatus(entry.key, entry.tx.from, { isSent: true, hash }))
            })
            .on('receipt', (receipt) => {
              dispatch(this.txStatus(entry.key, entry.tx.from, { isMined: true, receipt }))
              resolve(receipt)
            })
            .on('error', (error) => {
              dispatch(this.txStatus(entry.key, entry.tx.from, { isErrored: true, error }))
              reject(error)
            })
        })
      }
    )
  }

  @autobind
  signTransaction ({ entry, signer }) {
    return (
      async (dispatch, getState) => {
        try {
          const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

          dispatch(showSignerModal())
          const signed = await signer.signTransaction(omitBy(entry.tx, isNil), selectedWallet.encrypted[0].path)
          dispatch(closeSignerModal())

          const raw = signed.rawTransaction
          dispatch(this.txStatus(entry.key, entry.tx.from, { isSigned: true, raw }))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('signTransaction error: ', error)
          dispatch(closeSignerModal())
          dispatch(this.txStatus(entry.key, entry.tx.from, { isErrored: true, error }))
          throw error
        }
      }
    )
  }
}

const createTxEntryModel = (tx, options) =>
  new TxEntryModel({
    key: uuid(),
    tx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options && options.walletDerivedPath,
  })

const createTxExecModel = (tx, gasLimit, gasPrice, nonce, chainId) => {
  const data = tx.data != null
    ? tx.data
    : null

  return new TxExecModel({
    ...tx,
    hash: null,
    data,
    block: null,
    from: tx.from.toLowerCase(),
    to: tx.to.toLowerCase(),
    gasLimit: new BigNumber(gasLimit),
    gasPrice,
    nonce,
    chainId,
  })
}

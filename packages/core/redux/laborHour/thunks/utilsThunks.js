/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ETH, LHT } from '@chronobank/login/network/constants'
import { store } from 'redux/configureStore'
import { notify } from '../../notifier/actions'
import ErrorNoticeModel from '../../../models/notices/ErrorNoticeModel'
import { updateProcessingStatus } from '../actions'
import { pendingEntrySelector } from '../../transaction/selectors'
import { TX_DEPOSIT, TX_LOCK, TX_UNLOCK } from '../../../dao/constants/AssetHolderDAO'
import Amount from '../../../models/Amount'
import {
  daoByType,
  getLXDeposit,
  getLXLockedDeposit,
  getMainLaborHourWallet,
} from '../selectors'
import { daoByType as daoByTypeMainnet } from '../../daos/selectors'
import { TX_START_MINING_IN_CUSTOM_NODE } from '../dao/TimeHolderDAO'
import { estimateLaborHourGas } from './transactions'
import { estimateGas } from '../../ethereum/thunks'

// eslint-disable-next-line
export const notifyUnknownError = () => {
  notify(
    new ErrorNoticeModel({
      title: 'errors.labotHour.unknown.title',
      message: 'errors.labotHour.unknown.message',
    }),
  )
}

export const watchProcessingStatus = ({ status, blockchain, entry }) => (dispatch) => {
  dispatch(updateProcessingStatus(status))
  const unsubscribe = store.subscribe(() => {
    const txEntry = pendingEntrySelector(blockchain)(entry.tx.from, entry.key)(store.getState())
    if (txEntry && (txEntry.isRejected || txEntry.isErrored)) {
      unsubscribe()
      dispatch(updateProcessingStatus(null))
    }
  })
}

export const estimateGasForForms = (params, callback) => async (dispatch, getState) => {
  const action = params.get('action')
  const feeMultiplier = params.get('feeMultiplier')
  const lhthWallet = getMainLaborHourWallet(getState())
  const lockedDeposit = getLXLockedDeposit(lhthWallet.address)(getState())
  let dao
  let tx
  let isSidechain = false
  switch (action) {
    case TX_LOCK:
      if (lockedDeposit.gt(0)) {
        dao = daoByType('TimeHolderSidechain')(getState())
        tx = dao.unlockDepositAndResignMiner(params.get('token').address())
        isSidechain = true
      } else {
        dao = daoByTypeMainnet('TimeHolder')(getState())
        tx = dao[action](params.get('token').address(), params.get('amount'))
      }
      break
    case TX_DEPOSIT:
      dao = daoByTypeMainnet('TimeHolder')(getState())
      tx = dao[action](params.get('token').address(), params.get('amount'))
      break
    case TX_UNLOCK:
      dao = daoByType('TimeHolderSidechain')(getState())
      isSidechain = true
      if (lockedDeposit.gt(0)) {
        tx = dao.unlockDepositAndResignMiner(params.get('token').address())
      } else {
        tx = dao.withdrawShares(params.get('token').address(), params.get('amount'))
      }
      break
    case TX_START_MINING_IN_CUSTOM_NODE:
      dao = daoByType('TimeHolderSidechain')(getState())
      const wallet = getMainLaborHourWallet(getState())
      const lxDeposit = getLXDeposit(wallet.address)(getState())
      tx = dao.lockDepositAndBecomeMiner(params.get('token').address(), lxDeposit, params.get('delegateAddress'))
      isSidechain = true
  }
  try {
    const res = await (
      isSidechain
        ? dispatch(estimateLaborHourGas(tx))
        : dispatch(estimateGas(tx))
    )
    const { gasLimit, gasFee, gasPrice } = res
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(feeMultiplier), isSidechain ? LHT : ETH),
      gasPrice: new Amount(gasPrice.mul(feeMultiplier), isSidechain ? LHT : ETH),
    })
  } catch (e) {
    callback(e)
  }
}

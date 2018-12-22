/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import SimpleNoticeModel from '../../../models/notices/SimpleNoticeModel'
import { notify } from '../../notifier/actions'
import { getMainTokenForWalletByBlockchain } from '../../tokens/selectors'
/**
 *
 */
export const watchEOSMiddleware = () => () => {}

//#region callbacks
/**
 * @param {object} event
 *   claimId: claim._id,
 *   status: 'amount',
 *   blockchain: claim.blockchain,
 *   address: claim.address,
 *   amount: claim.amount,
 *   requiredAmount: claim.requiredAmount,
 *   startBlock: claim.startBlock,
 *   endBlock: claim.endBlock
 */
export const AmountEventCallback = (event) => (dispatch, getState) => {
  const { amount, blockchain } = event
  const token = getMainTokenForWalletByBlockchain(blockchain)(getState())
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'notices.eosNotices.AmountEvent.title',
        message: 'notices.eosNotices.AmountEvent.message',
        params: {
          amount: token.removeDecimals(amount),
          symbol: token.symbol(),
        },
      })
    )
  )
}

/**
 * @param {object} event
 * claimId: claim._id,
 * blockchain: claim.blockchain,
 * status: 'paid',
 * address: claim.address,
 * amount: claim.amount,
 * requiredAmount: claim.requiredAmount,
 * startBlock: claim.startBlock,
 * endBlock: claim.endBlock
 */
export const PaidEventCallback = () => (dispatch) => {
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'notices.eosNotices.PaidEvent.title',
        message: 'notices.eosNotices.PaidEvent.message',
      })
    )
  )
}

/**
 * @param {object} event
 * claimId: claim._id,
 * status: 'created',
 * eosAddress: claim.eosAddress
 */
export const CreatedEventCallback = (event) => (dispatch) => {
  const { eosAddress: account } = event
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'notices.eosNotices.CreatedEvent.title',
        message: 'notices.eosNotices.CreatedEvent.message',
        params: {
          account,
        },
      })
    )
  )
}

/**
 * @param {object} event
 * claimId: claim._id,
 * status: 'notCreated',
 * reason: claim.reason
 */
export const NotCreatedEventCallback = (event) => (dispatch) => {
  const { reason } = event
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'notices.eosNotices.NotCreatedEvent.title',
        message: 'notices.eosNotices.NotCreatedEvent.message',
        params: {
          reason,
        },
      })
    )
  )
}

/**
 * @param {object} event
 * claimId: claim._id,
 * blockchain: claim.blockchain,
 * status: 'timeout',
 * address: claim.address,
 * amount: claim.amount,
 * requiredAmount: claim.requiredAmount,
 * startBlock: claim.startBlock,
 * endBlock: claim.endBlock
 */
export const TimeoutEventCallback = () => (dispatch) => {
  dispatch(
    notify(
      new SimpleNoticeModel({
        icon: 'lock',
        title: 'notices.eosNotices.TimeoutEvent.title',
        message: 'notices.eosNotices.TimeoutEvent.message',
        params: {},
      })
    )
  )
}
//#endregion

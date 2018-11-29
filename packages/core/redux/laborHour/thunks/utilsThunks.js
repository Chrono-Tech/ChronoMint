/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { store } from 'redux/configureStore'
import { notify } from '../../notifier/actions'
import ErrorNoticeModel from '../../../models/notices/ErrorNoticeModel'
import { updateProcessingStatus } from '../actions'
import { pendingEntrySelector } from '../../transaction/selectors'

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

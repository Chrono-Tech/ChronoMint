/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_LABOR_HOUR } from './constants'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'
import { pendingSubSelector, getPendingEntrySubSelector } from '../abstractEthereum/utils/selectors'
import { WALLET_TYPE_MEMORY } from '../../models/constants/AccountEntryModel'
import LaborHourMemoryDevice from '../../services/signers/LaborHourMemoryDevice'

const laborHourSelector = () => (state) => state.get(DUCK_LABOR_HOUR)

export const web3Selector = () => createSelector(
  laborHourSelector(),
  (laborHour) => laborHour == null ? null : laborHour.web3.value,
)

export const laborHourPendingSelector = () => createSelector(laborHourSelector(), pendingSubSelector)

export const laborHourPendingEntrySelector = (address, key) => (
  createSelector(laborHourPendingSelector(), getPendingEntrySubSelector(address, key))
)

const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getLaborHourSigner = (state) => {
  const account = getPersistAccount(state)

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_MEMORY: {
      return new LaborHourMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}

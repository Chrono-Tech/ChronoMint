/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_EOS } from '../constants'
import { WALLET_TYPE_MEMORY } from '../../../models/constants/AccountEntryModel'
import EosMemoryDevice from '../../../services/signers/EosMemoryDevice'
import { getPersistAccount } from '../../persistAccount/selectors'

export const EOSDuckSelector = (state) => {
  return state.get(DUCK_EOS)
}

export const EOSSelector = (state) => {
  const duck = EOSDuckSelector(state)
  return duck.eos
}

export const getEOSTokens = (state) => {
  const duck = EOSDuckSelector(state)
  return duck.tokens
}

export const EOSPendingSelector = () => createSelector(
  EOSDuckSelector,
  (eos) => eos.pending,
)

export const eosPendingEntrySelector = (address, key) => createSelector(
  EOSPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getEosWallets = createSelector(
  EOSDuckSelector,
  (eosState) => {
    return eosState.wallets
  },
)

export const getWatchTimeoutId = (state) => {
  return state.get(DUCK_EOS).watchTimeoutId
}

export const getEOSWallet = (id) => createSelector(
  EOSDuckSelector,
  (eosState) => {
    return eosState.wallets[id]
  },
)

export const getEosSigner = (state) => {
  const account = getPersistAccount(state)

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new EosMemoryDevice({ privateKey })
    }
  }
}

export const eosPendingFormatSelector = () => createSelector(
  EOSPendingSelector(),
  (pending) => {
    return Object.values(pending)
      .flatMap((txList) => {
        return Object.values(txList)
          .filter((tx) => tx.isAccepted && !tx.isMined)
      })
  },
)

export const eosPendingCountSelector = () => createSelector(
  eosPendingFormatSelector(),
  (pendingList) => {
    return pendingList ? pendingList.length : 0
  },
)

export const getEOSWalletTransactions = (walletId) => (state) => {
  const wallet = getEOSWallet(walletId)(state)
  return wallet ? wallet.transactions : null
}

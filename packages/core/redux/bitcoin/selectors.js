/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'
import { DUCK_BITCOIN } from './constants'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR_MOCK,
  WALLET_TYPE_LEDGER_MOCK,
} from '../../models/constants/AccountEntryModel'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorDeviceMock'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'
import { BLOCKCHAIN_BITCOIN } from '../../dao/constants'

export const bitcoinSelector = () => (state) => state.get(DUCK_BITCOIN)

export const bitcoinPendingSelector = (blockchain) => createSelector(
  bitcoinSelector(),
  (scope) => scope[blockchain].pending,
)

export const pendingEntrySelector = (address, key, blockchain) => createSelector(
  bitcoinPendingSelector(blockchain),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getBtcSigner = (state) => {
  const account = getPersistAccount(state)
  const network = getSelectedNetwork()(state)
  const bitcoinNetwork = bitcoin.networks[network[BLOCKCHAIN_BITCOIN]]
  console.log('account: ', account)

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_LEDGER_MOCK: {
      return new BitcoinTrezorDeviceMock({ seed: account.decryptedWallet.privateKey, network: bitcoinNetwork })
    }
    case WALLET_TYPE_TREZOR_MOCK: {
      return new BitcoinTrezorDeviceMock({ seed: account.decryptedWallet.privateKey, network: bitcoinNetwork })
    }
    case WALLET_TYPE_MEMORY: {
      return new BitcoinMemoryDevice({ privateKey: account.decryptedWallet.privateKey.slice(2, 66), network: bitcoinNetwork })
    }
    default:
      //eslint-disable-next-line
      console.warn('Unknown wallet type')
  }
}

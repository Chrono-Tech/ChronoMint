/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'
import { camelCase, startCase } from 'lodash'
import { DUCK_BITCOIN } from './constants'
import { bitcoinSignersMap } from './signersMap'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'

export const bitcoinSelector = () => (state) =>
  state.get(DUCK_BITCOIN)

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

export const getBitcoinSigner = (state, blockchain) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[blockchain]]
  const privateKey = account.decryptedWallet.privateKey.slice(2, 66)

  const SignerName = `${startCase(camelCase(blockchain))}${startCase(camelCase(account.decryptedWallet.entry.encrypted[0].type))}Device`
  const SignerComponent = bitcoinSignersMap[SignerName]

  return new SignerComponent({ privateKey, network })
}

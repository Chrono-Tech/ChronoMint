/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesApi from '@waves/waves-api'
import { BLOCKCHAIN_WAVES } from '@chronobank/login/network/constants'
import { createSelector } from 'reselect'
import { DUCK_WAVES } from './constants'
import MetamaskPlugin from '../../services/signers/MetamaskPlugin'
import WavesMemoryDevice from '../../services/signers/WavesMemoryDevice'
import WavesLedgerDevice from '../../services/signers/WavesLedgerDevice'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_METAMASK,
  WALLET_TYPE_LEDGER,
} from '../../models/constants/AccountEntryModel'

export const wavesSelector = () => (state) => state.get(DUCK_WAVES)

export const wavesPendingSelector = () => createSelector(
  wavesSelector(),
  (waves) => waves.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  wavesPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getWavesSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = WavesApi[networkData[BLOCKCHAIN_WAVES]]
  switch (account.decryptedWallet.entry.encrypted[0].type) {
  case WALLET_TYPE_MEMORY: {
    const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
    return new WavesMemoryDevice({ seedPhrase: privateKey, network })
  }
  case WALLET_TYPE_LEDGER: {
    // return new WavesLedgerDeviceMock({ network })
    return new WavesLedgerDevice({ network })
  }
  case WALLET_TYPE_METAMASK: {
    return new MetamaskPlugin()
  }
  }
}

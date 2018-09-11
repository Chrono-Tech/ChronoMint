/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_NEM } from '@chronobank/login/network/constants'
import { createSelector } from 'reselect'
import nemSdk from 'nem-sdk'
import { DUCK_NEM } from './constants'
import MetamaskPlugin from '../../services/signers/MetamaskPlugin'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'

import NemMemoryDevice from '../../services/signers/NemMemoryDevice'
import NemTrezorDevice from '../../services/signers/NemTrezorDevice'
import NemTrezorDeviceMock from '../../services/signers/NemTrezorDeviceMock'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_METAMASK,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
} from '../../models/constants/AccountEntryModel'

export const nemSelector = () => (state) => state.get(DUCK_NEM)

export const nemPendingSelector = () => createSelector(
  nemSelector(),
  (nem) => nem.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  nemPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getNemSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = nemSdk.model.network.data[networkData[BLOCKCHAIN_NEM] ]

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new NemMemoryDevice({ privateKey, network })
    }
    case WALLET_TYPE_TREZOR_MOCK: {
      return new NemTrezorDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR: {
      return new NemTrezorDevice({ network })
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin()
    }
  }
}

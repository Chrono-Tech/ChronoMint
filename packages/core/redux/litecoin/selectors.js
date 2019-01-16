/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'
import {
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
} from '../../models/constants/AccountEntryModel'
import { BLOCKCHAIN_DASH } from '../../dao/constants'

import LitecoinMemoryDevice from '../../services/signers/LitecoinMemoryDevice'
import LitecoinTrezorDevice from '../../services/signers/LitecoinTrezorDevice'
import BitcoinMemoryDevice from "../../services/signers/BitcoinMemoryDevice";

export const getLitecoinSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_DASH]]
  const isTestnet = networkData[BLOCKCHAIN_DASH] === 'testnet'

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new LitecoinMemoryDevice({ privateKey  })
    }
    case WALLET_TYPE_LEDGER: {
      if (process.env.DEVICE_MOCKS) {
        return new BitcoinMemoryDevice({ network })
      }
      return new BitcoinMemoryDevice({ network })
    }
    case WALLET_TYPE_TREZOR: {
      if (process.env.DEVICE_MOCKS) {
        return new LitecoinTrezorDevice({ network })
      }
      return new LitecoinTrezorDevice({ network, isTestnet })
    }
  }
}

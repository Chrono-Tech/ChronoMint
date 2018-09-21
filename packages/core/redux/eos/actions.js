/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  TX_CREATE,
  TX_UPDATE,
  TX_REMOVE,
  EOS_UPDATE,
  EOS_UPDATE_WALLET,
} from './constants'

export const updateEos = (eos) => ({
  type: EOS_UPDATE,
  eos,
})

export const updateWallet = (wallet) => ({
  type: EOS_UPDATE_WALLET,
  wallet,
})

export const eosTxCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const eosTxUpdate = (key, address, tx) => ({
  type: TX_UPDATE,
  address,
  key,
  tx,
})

export const eosTxRemove = (key, address) => ({
  type: TX_REMOVE,
  address,
  key,
})

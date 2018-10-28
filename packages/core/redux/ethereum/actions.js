/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  NONCE_UPDATE,
  TX_CREATE,
  TX_UPDATE,
  WEB3_UPDATE,
} from './constants'

export const ethTxCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const ethTxUpdate = (key, address, tx) => ({
  type: TX_UPDATE,
  address,
  key,
  tx,
})

export const ethNonceUpdate = (address, nonce) => ({
  type: NONCE_UPDATE,
  address,
  nonce,
})

export const ethWeb3Update = (web3) => ({
  type: WEB3_UPDATE,
  web3,
})

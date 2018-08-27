/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  NONCE_UPDATE,
  TX_CREATE,
  TX_STATUS,
  WEB3_UPDATE,
} from './constants'

export const ethTxCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const ethTxStatus = (key, address, props) => ({
  type: TX_STATUS,
  address,
  key,
  props,
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

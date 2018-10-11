/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  WEB3_UPDATE,
} from './constants'

import {
  nonceUpdate as ethNonceUpdate,
  txCreate as ethTxCreate,
  txUpdate as ethTxUpdate,
} from '../ethereumLikeBlockchain/actions'

export {
  ethNonceUpdate,
  ethTxCreate,
  ethTxUpdate
}

export const ethWeb3Update = (web3) => ({
  type: WEB3_UPDATE,
  web3,
})

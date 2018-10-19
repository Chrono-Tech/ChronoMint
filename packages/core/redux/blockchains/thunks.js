/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '@chronobank/login/network/constants'

import { getBlockchains } from './selectors'
import { enableBitcoin } from '../bitcoin/thunks'
import { enableEthereum } from '../ethereum/thunks'
import { enableNem } from '../nem/thunks'
import { enableWaves } from '../waves/thunks'

const enableMap = {
  [BLOCKCHAIN_ETHEREUM]: enableEthereum(),
  [BLOCKCHAIN_BITCOIN]: enableBitcoin(BLOCKCHAIN_BITCOIN),
  [BLOCKCHAIN_BITCOIN_CASH]: enableBitcoin(BLOCKCHAIN_BITCOIN_CASH),
  [BLOCKCHAIN_LITECOIN]: enableBitcoin(BLOCKCHAIN_LITECOIN),
  [BLOCKCHAIN_DASH]: enableBitcoin(BLOCKCHAIN_DASH),
  [BLOCKCHAIN_NEM]: enableNem(),
  [BLOCKCHAIN_WAVES]: enableWaves(),
}

export const enableActiveBlockchains = () => (dispatch, getState) => {
  const state = getState()
  const activeBlockchains = getBlockchains(state)
  console.log('activeBlockchains: ', activeBlockchains)

  activeBlockchains.forEach((blockchain) => {
    if (!enableMap[blockchain]) {
      console.log('not found blockchain: ', blockchain)
      return
    }
    console.log('enable blockchain: ', blockchain)

    dispatch(enableMap[blockchain])
  })
}

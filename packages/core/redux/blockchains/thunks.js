/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/constants'

import { getBlockchains } from './selectors'
import { enableBlockchain } from '../bitcoin/initialization'

const enableMap = {
  [BLOCKCHAIN_BITCOIN]: enableBlockchain(BLOCKCHAIN_BITCOIN),
  [BLOCKCHAIN_BITCOIN_CASH]: enableBlockchain(BLOCKCHAIN_BITCOIN_CASH),
  [BLOCKCHAIN_LITECOIN]: enableBlockchain(BLOCKCHAIN_LITECOIN),
  [BLOCKCHAIN_DASH]: enableBlockchain(BLOCKCHAIN_DASH),
}

export const enableActiveBlockchains = () => (dispatch, getState) => {

  const state = getState()
  const activeBlockchains = getBlockchains(state)

  console.log('activeBlockchains: ', activeBlockchains)

  activeBlockchains.forEach((blockchain) => {
    console.log('blockchain: ', blockchain)
    if (!enableMap[blockchain]) {
      console.log('Blockchain to enable is not found')
      return
    }

    dispatch(enableMap[blockchain])
  })
}

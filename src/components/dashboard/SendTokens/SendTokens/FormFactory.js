/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_NEM,
} from '@chronobank/core/dao/constants'

import Bitcoin from '../Bitcoin/FormContainer'
import Ethereum from '../Ethereum/FormContainer'
import Nem from '../Nem/FormContainer'
import Waves from '../Waves/FormContainer'

export const getForm = (blockchain: string) => {
  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
    case BLOCKCHAIN_BITCOIN_CASH:
    case BLOCKCHAIN_BITCOIN_GOLD:
    case BLOCKCHAIN_LITECOIN:
      return Bitcoin
    case BLOCKCHAIN_ETHEREUM:
      return Ethereum
    case BLOCKCHAIN_WAVES:
      return Waves
    case BLOCKCHAIN_NEM:
      return Nem
    default:
      return null
  }
}

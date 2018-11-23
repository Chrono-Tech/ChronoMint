/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { bccProvider, btcProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { dashProvider } from '@chronobank/login/network/DashProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'

import { getMainSymbolForBlockchain } from './selectors'
import { Amount } from '../../models'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_NEM,
} from '../../dao/constants'

export const providersMap = {
  [BLOCKCHAIN_BITCOIN]: btcProvider,
  [BLOCKCHAIN_BITCOIN_CASH]: bccProvider,
  [BLOCKCHAIN_DASH]: dashProvider,
  [BLOCKCHAIN_ETHEREUM]: ethereumProvider,
  [BLOCKCHAIN_LABOR_HOUR]: laborHourProvider,
  [BLOCKCHAIN_LITECOIN]: ltcProvider,
  [BLOCKCHAIN_NEM]: nemProvider,
  [BLOCKCHAIN_WAVES]: wavesProvider,
}

export const getProviderByBlockchain = (blockchain) => {
  return providersMap[blockchain] || null
}

export const getWalletBalances = ({ wallet }) => {
  try {
    console.log('getWalletBalances: ', wallet)
    return providersMap[wallet.blockchain].getAccountBalances(wallet.address)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Cannot find provider for the %s blockchain', wallet.blockchain)
    return Promise.reject(`Cannot find provider for the ${wallet.blockchain} blockchain`)
  }
}

export const formatBalances = (blockchain, balancesResult) => {
  const mainSymbol = getMainSymbolForBlockchain(blockchain)
  if (balancesResult && balancesResult.tokens) {
    // @todo fix on Middleware empty object in case of empty balance
    if (JSON.stringify({}) === JSON.stringify(balancesResult.tokens)) {
      balancesResult.tokens = []
    }
    const tokensBalances = balancesResult.tokens
      .reduce((accumulator, { symbol, balance }) => {
        return {
          ...accumulator,
          [symbol]: new Amount(balance, symbol),
        }
      }, {})

    return {
      [mainSymbol]: new Amount(balancesResult.balance, mainSymbol),
      ...tokensBalances,
    }
  } else {
    return {
      [mainSymbol]: new Amount(balancesResult, mainSymbol),
    }
  }
}

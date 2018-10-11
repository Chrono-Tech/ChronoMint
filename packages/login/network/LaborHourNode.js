/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { NETWORK_MAIN_ID } from './settings'
import EthereumMiddlewareNode from './EthereumMiddlewareNode'

// TODO @dkchv: update to actual config
const LHT_TESTNET_NODE = new EthereumMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-sidechain-laborx.chronobank.io',
    timeout: 10000,
  }),
  twoFA: axios.create({
    baseURL: 'https://middleware-sidechain-laborx.chronobank.io/2fa',
    timeout: 10000,
  }),
  trace: true,
})

/**
 *
 * @param network object from SessionThunks.getProviderSettings()
 * @returns {EthereumMiddlewareNode}
 */
export default function selectEthereumNode (network) {
  return (network.id === NETWORK_MAIN_ID) ? LHT_MAINNET_NODE : LHT_TESTNET_NODE
}

const LHT_MAINNET_NODE = new EthereumMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-sidechain-laborx.chronobank.io',
    timeout: 10000,
  }),
  twoFA: axios.create({
    baseURL: 'https://middleware-sidechain-laborx.chronobank.io/2fa',
    timeout: 10000,
  }),
  trace: true,
})

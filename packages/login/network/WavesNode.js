/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import * as WavesApi from '@waves/waves-api'
import WavesMiddlewareNode from './WavesMiddlewareNode'

export const WAVES_MAINNET_NODE = new WavesMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-waves-mainnet-rest.chronobank.io',
    timeout: 30000,
  }),
  socket: {
    baseURL: 'wss://rabbitmq-prod-ws.chronobank.io/ws',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/mainnet-waves-middleware-chronobank-io_balance',
      transaction: '/exchange/events/mainnet-waves-middleware-chronobank-io_transaction',
    },
  },
  trace: true,
})

export const WAVES_TESTNET_NODE = new WavesMiddlewareNode({
  api: axios.create({
    baseURL: 'https://middleware-waves-testnet-rest.chronobank.io',
    timeout: 30000,
  }),
  socket: {
    baseURL: 'wss://rabbitmq-stage-webstomp.chronobank.io/ws',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/testnet-waves-middleware-chronobank-io_balance',
      transaction: '/exchange/events/testnet-waves-middleware-chronobank-io_transaction',
    },
  },
  trace: true,
})

export function selectWavesNode (network) {
  return WavesApi[network['Waves']] === WavesApi.MAINNET_CONFIG
    ? WAVES_MAINNET_NODE
    : WAVES_TESTNET_NODE
}

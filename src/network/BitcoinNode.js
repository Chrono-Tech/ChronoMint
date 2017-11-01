import axios from 'axios'

import BitcoinBlockexplorerNode from './BitcoinBlockexplorerNode'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

export const MAINNET = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const TESTNET = new BitcoinMiddlewareNode({
  api: axios.create({
    // baseURL: 'http://35.185.102.79:8080',
    baseURL: 'http://54.149.244.28:8080',
    timeout: 4000,
  }),
  socket: {
    // baseURL: 'http://35.185.102.79:8081/stomp',
    baseURL: 'http://54.218.43.230:15674/stomp',
    // user: 'rabbitmq_user',
    // password: '38309100024',
    user: 'test',
    password: 'test123',
    channels: {
      // balance: '/exchange/events/app_testnet-bitcoin-middleware-chronobank-io_balance',
      balance: '/exchange/events/app_bitcoin_balance',
    },
  },
  trace: true,
})

export const MAINNET_BCC = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'https://bitcoincash.blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const TESTNET_BCC = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: 'http://tbcc.blockdozer.com/insight-api/',
    timeout: 4000,
  }),
  trace: true,
})

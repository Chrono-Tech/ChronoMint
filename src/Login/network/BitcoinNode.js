import axios from 'axios'
import BitcoinBlockexplorerNode from './BitcoinBlockexplorerNode'
import BitcoinMiddlewareNode from './BitcoinMiddlewareNode'

export const MAINNET = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: '//blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const TESTNET = new BitcoinMiddlewareNode({
  api: axios.create({
    baseURL: '//middleware-bitcoin-testnet-rest.chronobank.io',
    timeout: 4000,
  }),
  socket: {
    baseURL: '//middleware-bitcoin-testnet-rest.chronobank.io/stomp',
    user: 'rabbitmq_user',
    password: '38309100024',
    channels: {
      balance: '/exchange/events/app_testnet-bitcoin-middleware-chronobank-io_balance',
    },
  },
  trace: true,
})

export const MAINNET_BCC = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: '//bitcoincash.blockexplorer.com/api/',
    timeout: 4000,
  }),
  trace: false,
})

export const TESTNET_BCC = new BitcoinBlockexplorerNode({
  api: axios.create({
    baseURL: '//tbcc.blockdozer.com/insight-api/',
    timeout: 4000,
  }),
  trace: true,
})

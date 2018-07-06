/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3_1'
import { ethDAO } from '../daos/index'

// TODO @ipavlenko: Move to config file
const config = {
  blockchain: {
    websocket: 'wss://parity.tp.ntr1x.com:8546',
  },
}

export default () => {
  const web3Provider =
    // Web3.givenProvider ||
    new Web3.providers.WebsocketProvider(config.blockchain.websocket)
  // || new Web3.providers.HttpProvider(config.blockchain.rpc)
  const web3 = new Web3(web3Provider)
  ethDAO.connect(web3)
  return web3
}

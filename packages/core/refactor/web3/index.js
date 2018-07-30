/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import { ethDAO } from '../daos/index'

export default (network) => {
  if (!network.ws) {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://' + network.host));
    console.log(web3)
    ethDAO.connect(web3)
    return web3
  }
  const web3Provider = new Web3.providers.WebsocketProvider(network.ws)
  const web3 = new Web3(web3Provider)
  ethDAO.connect(web3)
  return web3
}

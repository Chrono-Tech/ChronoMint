/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3_1'
import ethDAO from '../dao/ETHDAO'

export default (network) => {
  if (!network.ws) {
    return null
  }
  const web3Provider = new Web3.providers.WebsocketProvider(network.ws)
  const web3 = new Web3(web3Provider)
  ethDAO.connect(web3)
  return web3
}
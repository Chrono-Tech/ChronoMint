/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'

export default (network) => {
  if (!network.ws) {
    return null
  }
  const web3Provider = new Web3.providers.WebsocketProvider(network.ws)
  return new Web3(web3Provider)
}

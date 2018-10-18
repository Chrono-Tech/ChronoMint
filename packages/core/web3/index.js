/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'

export default (network) => {
  if (!network.ws) {
    return null
  }
  // TODO @abdulov remove console.log
  console.log('%c network', 'background: #222; color: #fff', network)
  const web3Provider = new Web3.providers.WebsocketProvider(network.ws)
  return new Web3(web3Provider)
}

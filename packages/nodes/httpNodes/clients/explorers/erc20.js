/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

export const etherscan = {
  client: axios.create({
    baseURL: 'https://etherscan.io/tx',
    responseType: 'json',
  }),
}

export const api_etherscan = {
  client: axios.create({
    baseURL: 'https://api.etherscan.io',
    responseType: 'json',
  }),
}

export const rinkeby_etherscan = {
  client: axios.create({
    baseURL: 'https://rinkeby.etherscan.io',
    responseType: 'json',
  }),
}

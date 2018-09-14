/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

export const blockexplorer = {
  client: axios.create({
    baseURL: 'https://blockexplorer.com/tx',
    responseType: 'json',
  }),
}

export const blockcypher = {
  client: axios.create({
    baseURL: 'https://live.blockcypher.com/btc-testnet/tx',
    responseType: 'json',
  }),
}

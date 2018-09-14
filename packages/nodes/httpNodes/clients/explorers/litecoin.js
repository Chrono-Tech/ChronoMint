/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

export const live_blockcypher_ltc = {
  client: axios.create({
    baseURL: 'https://live.blockcypher.com/ltc/tx',
    responseType: 'json',
  }),
}

export const chain_so = {
  client: axios.create({
    baseURL: 'https://chain.so/tx/LTCTEST',
    responseType: 'json',
  }),
}

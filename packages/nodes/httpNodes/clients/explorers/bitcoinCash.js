/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

export const bcc_blockdozer = {
  client: axios.create({
    baseURL: 'https://bcc.blockdozer.com/insight/tx',
    responseType: 'json',
    withCredentials: false,
  }),
}

export const tbcc_blockdozer = {
  client: axios.create({
    baseURL: 'https://tbcc.blockdozer.com/insight/tx',
    responseType: 'json',
    withCredentials: false,
  }),
}

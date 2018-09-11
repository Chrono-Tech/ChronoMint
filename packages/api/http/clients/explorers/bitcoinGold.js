/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

// eslint-disable-next-line import/prefer-default-export
export const btgexplorer = {
  client: axios.create({
    baseURL: 'https://btgexplorer.com/tx',
    responseType: 'json',
  }),
}

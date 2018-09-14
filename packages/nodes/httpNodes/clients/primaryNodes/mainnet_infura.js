/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const timeout = 10000

// eslint-disable-next-line import/prefer-default-export
export const mainnet_infura_io = {
  client: axios.create({
    baseURL: 'https://mainnet.infura.io/PVe9zSjxTKIP3eAuAHFA',
    responseType: 'json',
    timeout,
  }),
  options: {
    interceptors: {
      response: [{
        // eslint-disable-next-line no-unused-vars
        success: ({ getState, dispatch, getSourceAction }, request) => {
          return {
            data: request.data,
            request: request.request.responseURL,
          }
        },
      }],
    },
  },
}


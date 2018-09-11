/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const timeout = 30000

export const middleware_waves_testnet_rest = {
  client: axios.create({
    baseURL: 'https://middleware-waves-testnet-rest.chronobank.io',
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

export const middleware_waves_mainnet_rest = {
  client: axios.create({
    baseURL: 'https://middleware-waves-mainnet-rest.chronobank.io',
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

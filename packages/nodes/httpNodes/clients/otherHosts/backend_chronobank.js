/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const timeout = 10000

const DEFAULT_BACKEND_HOST = 'https://backend.chronobank.io'
// eslint-disable-next-line no-undef
const CURRENT_BACKEND_HOST = PUBLIC_BACKEND_REST_URL || DEFAULT_BACKEND_HOST // PUBLIC_BACKEND_REST_URL - global CONST from Webpack
const BASE_PATH = '/api/v1'

// eslint-disable-next-line import/prefer-default-export
export const backend_chronobank = {
  client: axios.create({
    baseURL: CURRENT_BACKEND_HOST + BASE_PATH,
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

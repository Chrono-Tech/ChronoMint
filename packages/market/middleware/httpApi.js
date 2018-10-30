/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// INFO: See API at https://min-api.cryptocompare.com/

import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://min-api.cryptocompare.com',
  responseType: 'json',
  timeout: 10000,
})

// eslint-disable-next-line import/prefer-default-export
export const requestPrices = (tokens, currencies) => {
  return axiosClient.get(`/data/pricemulti?fsyms=${tokens}&tsyms=${currencies}`)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

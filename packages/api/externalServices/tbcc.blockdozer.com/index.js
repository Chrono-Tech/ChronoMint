/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/** @module HTTP/tbcc.blockdozer.com */

import axios from 'axios'

const baseURL = 'https://tbcc.blockdozer.com/insight-api'
const timeout = 10000 // 10 seconds

const URL_BCC_CONFIRMED_BALANCE = (address) => `addr/${address}/balance`
const URL_BCC_UNCONFIRMED_BALANCE = (address) => `addr/${address}/unconfirmedBalance`

const service = axios.create({
  baseURL,
  timeout,
  withCredentials: false, // 'true' will cause CORS error during request
})

/**
 * Request confirmed balance by Bitcoin Cash address
 * @param {string} Bitcoin Gold wallet's address
 * @return {Promise} Axios GET request for further processing.
 */
export const requestConfirmedBalance = (address) =>
  service.request({
    method: 'GET',
    url: URL_BCC_CONFIRMED_BALANCE(address),
  })

/**
 * Request unconfirmed balance by Bitcoin Cash address
 * @param {string} Bitcoin Gold wallet's address
 * @return {Promise} Axios GET request for further processing.
 */
export const requestUnconfirmedBalance = (address) =>
  service.request({
    method: 'GET',
    url: URL_BCC_UNCONFIRMED_BALANCE(address),
  })

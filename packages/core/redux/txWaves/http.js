/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { MAINNET_CONFIG } from '@waves/waves-api'

const urlGetBalance = (address) => `addr/${address}/balance`
const urlGetTransactionList = (address, skip, offset) => `tx/${address}/history?skip=${skip}&limit=${offset}`
const urlGetTransactionInfo = (txId) => `tx/${txId}`
const URL_SEND_TX = 'tx/send'

const URL_WAVES_MAINNET = 'https://middleware-waves-mainnet-rest.chronobank.io'
const URL_WAVES_TESTNET = 'https://middleware-waves-testnet-rest.chronobank.io'

const REQUEST_TIMEOUT = 30000

export default class WavesHttpService {
  static testnetService = axios.create({
    baseURL: URL_WAVES_TESTNET,
    timeout: REQUEST_TIMEOUT,
  })
  static mainnetService = axios.create({
    baseURL: URL_WAVES_MAINNET,
    timeout: REQUEST_TIMEOUT,
  })
  static service = WavesHttpService.testnetService // Testnet by default

  static selectNetwork (network) {
    network && network === MAINNET_CONFIG
      ? WavesHttpService.service = WavesHttpService.mainnetService
      : WavesHttpService.service = WavesHttpService.testnetService
  }

  static requestTransactionInfo (txId: string) {
    return WavesHttpService.service.request({
      method: 'GET',
      url: urlGetTransactionInfo(txId),
    })
  }

  static requestBalance (address: string) {
    return WavesHttpService.service.request({
      method: 'GET',
      url: urlGetBalance(address),
    })
  }

  static requestTransactionList (address, skip, offset) {
    return WavesHttpService.service.request({
      method: 'GET',
      url: urlGetTransactionList(address, skip, offset),
    })
  }

  static requestSendTx (tx) {
    return WavesHttpService.service.request({
      method: 'POST',
      url: URL_SEND_TX,
      data: tx,
    })
  }

}

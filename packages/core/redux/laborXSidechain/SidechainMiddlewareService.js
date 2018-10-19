/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const URL_MIDDLEWARE_SIDECHAIN_HOST = 'http://localhost:8081/'
const URL_MIDDLEWARE_SIDECHAIN_BASE_PATH = URL_MIDDLEWARE_SIDECHAIN_HOST + 'mainnet/'

const URL_SWAPS_LIST = 'swaps/'
const URL_SWAP_OBTAIN = 'swaps/obtain/'

export default class SidechainMiddlewareService {
  static service = axios.create({ baseURL: URL_MIDDLEWARE_SIDECHAIN_BASE_PATH })

  static getSwapListByAddress (userAddress: string) {
    return SidechainMiddlewareService.service.request({
      url: `${URL_SWAPS_LIST}${userAddress}`,
      json: true,
    })
  }

  static obtainSwapInSidechain (swapId: string, userPubKey: string) {
    return SidechainMiddlewareService.service.request({
      method: 'POST',
      url: `${URL_SWAP_OBTAIN}${swapId}`,
      body: {
        pubkey: userPubKey,
      },
      json: true,
    })
  }
}

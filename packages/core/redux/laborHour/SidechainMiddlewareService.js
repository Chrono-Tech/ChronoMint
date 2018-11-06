/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const URL_MIDDLEWARE_SIDECHAIN_HOST = 'http://localhost:8081/'

const URL_SWAPS_LIST = 'mainnet/swaps/'
const URL_SWAP_OBTAIN = 'mainnet/swaps/obtain/'
const URL_SWAPS_LIST_TO_MAINNET = 'sidechain/swaps/'
const URL_SWAP_OBTAIN_TO_MAINNET = 'sidechain/swaps/obtain/'

export default class SidechainMiddlewareService {
  static service = axios.create({ baseURL: URL_MIDDLEWARE_SIDECHAIN_HOST })

  static getSwapListFromMainnetToSidechainByAddress (userAddress: string) {
    return SidechainMiddlewareService.service.request({
      url: `${URL_SWAPS_LIST}${userAddress}`,
      json: true,
    })
  }

  static obtainSwapFromMainnetToSidechain (swapId: string, userPubKey: string) {
    return SidechainMiddlewareService.service.request({
      method: 'POST',
      url: `${URL_SWAP_OBTAIN}${swapId}`,
      data: {
        pubkey: userPubKey,
      },
    })
  }

  static getSwapListFromSidechainToMainnetByAddress (userAddress: string) {
    return SidechainMiddlewareService.service.request({
      url: `${URL_SWAPS_LIST_TO_MAINNET}${userAddress}`,
      json: true,
    })
  }

  static obtainSwapFromSidechainToMainnet (swapId: string, userPubKey: string) {
    return SidechainMiddlewareService.service.request({
      method: 'POST',
      url: `${URL_SWAP_OBTAIN_TO_MAINNET}${swapId}`,
      data: {
        pubkey: userPubKey,
      },
    })
  }
}

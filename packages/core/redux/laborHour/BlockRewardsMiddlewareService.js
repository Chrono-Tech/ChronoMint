/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
// import { BigNumber } from 'bignumber.js'
import { LHT } from '../../dao/constants'
import Amount from '../../models/Amount'

const URL_MIDDLEWARE_SIDECHAIN_HOST = 'http://localhost:8081/'

// const URL_TOTAL_REWARD = ''
// const URL_BLOCK = ''
// const URL_BLOCKS_LIST = 'blocks/history'

export default class BlockRewardsMiddlewareService {
  static service = axios.create({ baseURL: URL_MIDDLEWARE_SIDECHAIN_HOST })

  static getTotalReward () {
    /*return SidechainMiddlewareService.service.request({
      url: `${URL_SWAPS_LIST}${userAddress}`,
      json: true,
    })*/
    return { data: new Amount(1000000000000000000, LHT) }
  }

  static getBlocksList (/*skip, limit*/) {
    /*return SidechainMiddlewareService.service.request({
      url: `${URL_BLOCKS_LIST}${userAddress}`,
    })*/
    return {
      data: [
        {
          "hash": "0x83649bc4986b45c9c5c508b945c0b195bce9c17952817fbe9c52ba4ee3b12b4e",
          "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
          "signers": [],
          "number": 346561,
          "timestamp": 1444208649,
          "totalTxFee": "1050000000000000",
          "uncleAmount": 0,
          "rewards": [
            {
              "reward": "5001050000000000000",
              "address": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
            },
          ],
        },
        {
          "hash": "0x36ee7163f05e2b7b52f6794773ddb3801c57e25f8a1ce49532be9f0ff5b29c69",
          "miner": "0x95581ea0c5b362933f3523138f54d51eae817211",
          "signers": [],
          "number": 346560,
          "timestamp": 1444208631,
          "totalTxFee": "0",
          "uncleAmount": 0,
          "rewards": [
            {
              "reward": "5000000000000000000",
              "address": "0x95581ea0c5b362933f3523138f54d51eae817211",
            },
          ],
        },
        {
          "hash": "0xb64b5cd07c17801095ce90d574a8c7c57e16a873f212bfae35d999ef47043f65",
          "miner": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
          "signers": [],
          "number": 346559,
          "timestamp": 1444208614,
          "totalTxFee": "0",
          "uncleAmount": 1,
          "rewards": [
            {
              "reward": "5156250000000000000",
              "address": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5",
            },
          ],
        },
        {
          "hash": "0x9fb7b0408a2fb1fb874e59c5f5471a1bfe01070548855a0c8feccb2428fad199",
          "miner": "0xabeac6e2183a94cf507a3b2de48e560709450281",
          "signers": [],
          "number": 346558,
          "timestamp": 1444208608,
          "totalTxFee": "0",
          "uncleAmount": 0,
          "rewards": [
            {
              "reward": "5000000000000000000",
              "address": "0xabeac6e2183a94cf507a3b2de48e560709450281",
            },
          ],
        },
        {
          "hash": "0x1fc83f99ac2092f31b41d8c44878693560b4e1963baebc65a306519080c068bf",
          "miner": "0x4bb96091ee9d802ed039c4d1a5f6216f90f81b01",
          "signers": [],
          "number": 346557,
          "timestamp": 1444208599,
          "totalTxFee": "0",
          "uncleAmount": 0,
          "rewards": [
            {
              "reward": "5000000000000000000",
              "address": "0x4bb96091ee9d802ed039c4d1a5f6216f90f81b01",
            },
          ],
        },
      ],
    }
  }

  static getBlock (/*blockNumberOrHash*/) {
    /*return SidechainMiddlewareService.service.request({
     url: `${URL_BLOCK}/${blockNumberOrHash}`,
   })*/
    return {
      data: {
        "hash": "0xd12fbc7f0563550933474b7944917e999cbd548683feb0d7f2492ed4b6e56c02",
        "miner": "0x0020ee4be0e2027d76603cb751ee069519ba81a1",
        "number": 9565593,
        "timestamp": 1543829088,
        "totalTxFee": "693890000000000",
        "uncleAmount": 0,
        "created": "2018-12-10T10:26:08.532Z",
      },
    }
  }
}

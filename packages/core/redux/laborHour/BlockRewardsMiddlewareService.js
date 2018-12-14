/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { BigNumber } from 'bignumber.js'

const URL_MIDDLEWARE_SIDECHAIN_HOST = 'http://localhost:8081/'

const URL_TOTAL_REWARD = ''
const URL_BLOCK = ''
const URL_BLOCKS_LIST = 'blocks/history'

export default class BlockRewardsMiddlewareService {
  static service = axios.create({ baseURL: URL_MIDDLEWARE_SIDECHAIN_HOST })

  static getTotalReward (userAddress: string) {
    /*return SidechainMiddlewareService.service.request({
      url: `${URL_SWAPS_LIST}${userAddress}`,
      json: true,
    })*/
    return { data: new BigNumber(10000) }
  }

  static getBlocksList (/*skip, limit*/) {
    /*return SidechainMiddlewareService.service.request({
      url: `${URL_BLOCKS_LIST}${userAddress}`,
    })*/
    return {
      data: [
        {
          hash:
            '0x26c08f1e0022a17e7e88324a2d78f04969a2a40f349271715b2a056d6c0ed9b6',
          miner: '0x00d6cc1ba9cf89bd2e58009741f4f7325badc0ed',
          number: 9591279,
          timestamp: 1544014044,
          totalTxFee: '6004278000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x4b279b3a6e7fdbc4e06428e18db9b83a4ba7b8fe6325b4bac1c32d418f2af561',
          miner: '0x00a0a24b9f0e5ec7aa4c7389b8302fd0123194de',
          number: 9591278,
          timestamp: 1544014040,
          totalTxFee: '1696262000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x5a9f26b4659d21e51aa4759c4b303bfc372ca5236fc0e5ff3d84c110e3671314',
          miner: '0x007733a1fe69cf3f2cf989f81c7b4cac1693387a',
          number: 9591277,
          timestamp: 1544014028,
          totalTxFee: '188323000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0xe85124ff4c629ad8a8f7c3edf543af2f4c34d4b466efbf36c1eca8fb9a7cfcae',
          miner: '0x0010f94b296a852aaac52ea6c5ac72e03afd032d',
          number: 9591276,
          timestamp: 1544014024,
          totalTxFee: '240042000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x3832d52ec98cec172a1d486246b2e56c9f5c615394db37fa3431a3ba8d8d6e77',
          miner: '0x0020ee4be0e2027d76603cb751ee069519ba81a1',
          number: 9591275,
          timestamp: 1544014020,
          totalTxFee: '782042166000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x7bd8cfc2ca64d97b0aa3217be0436f4b89944948b984fa1b983b40daca3adece',
          miner: '0x00d6cc1ba9cf89bd2e58009741f4f7325badc0ed',
          number: 9591274,
          timestamp: 1544014008,
          totalTxFee: '444548500000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x830178ae5e3a6c5b483cd89c9ed11230549292cf702975ed638688250c888aba',
          miner: '0x00a0a24b9f0e5ec7aa4c7389b8302fd0123194de',
          number: 9591273,
          timestamp: 1544014004,
          totalTxFee: '231648000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x0bca49f4c22219f2f46c4e0e8e920623e1c157f9243291283b5966aee15ca5c5',
          miner: '0x007733a1fe69cf3f2cf989f81c7b4cac1693387a',
          number: 9591272,
          timestamp: 1544013992,
          totalTxFee: '21507846000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x706dcaa0a209b37c4640c7e42a5143ec40b5c9220273346d22681122ae21a498',
          miner: '0x0010f94b296a852aaac52ea6c5ac72e03afd032d',
          number: 9591271,
          timestamp: 1544013988,
          totalTxFee: '383697000000000',
          uncleAmount: 0,
          reward: 500000,
        },
        {
          hash:
            '0x457f1bb9cda5edbf4818eab3f9315ec8f5da9c95a874abefe6102d92d0ac7112',
          miner: '0x0020ee4be0e2027d76603cb751ee069519ba81a1',
          number: 9591270,
          timestamp: 1544013984,
          totalTxFee: '5271232000000000',
          uncleAmount: 0,
          reward: 500000,
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

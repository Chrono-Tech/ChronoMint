/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { NETWORK_MAIN_ID } from '@chronobank/login/network/settings'

const URL_PROFILE_HOST = 'http://localhost:8084/'
const URL_PROFILE_HOST_TESTNET = 'http://localhost:8084/'

const URL_CREATE_CLAIM = 'claims'

export default class EOSAccountService {
  static init = (networkID) => {
    const profileHost = networkID === NETWORK_MAIN_ID ? URL_PROFILE_HOST : URL_PROFILE_HOST_TESTNET
    EOSAccountService.service = axios.create({ baseURL: profileHost })
  }

  static createClaim (token, data) {
    return EOSAccountService.service.request({
      method: 'POST',
      url: URL_CREATE_CLAIM,
      headers: { Authorization: 'Bearer ' + token },
      data,
    })
  }
}

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const BASE_URL = 'https://rabbitmq-webstomp.chronobank.io/stomp'
const USER = 'rabbitmq_user'
const PASSWORD = '38309100024'

const WAVES_MAINNET_CHANNELS = {
  balance: '/exchange/events/mainnet-waves-middleware-02-chronobank-io_balance',
  transaction: '/exchange/events/mainnet-waves-middleware-02-chronobank-io_transaction',
}
const WAVES_TESTNET_CHANNELS = {
  balance: '/exchange/events/testnet-waves-middleware-02-chronobank-io_balance',
  transaction: '/exchange/events/testnet-waves-middleware-02-chronobank-io_transaction',
}

export class WavesWebSocketService {
  static channel = WAVES_TESTNET_CHANNELS
  static socket = null
  static client = null

  static selectChannel (channel) {
    channel && channel === 'main'
      ? WavesWebSocketService.channel = WAVES_MAINNET_CHANNELS
      : WavesWebSocketService.channel = WAVES_TESTNET_CHANNELS
  }

  static connect () {
    WavesWebSocketService.socket = new SockJS(BASE_URL)
    WavesWebSocketService.client = Stomp.over(this._ws, {
      heartbeat: false,
      debug: false,
    })
    this._client.connect(
      USER,
      PASSWORD,
      this._handleConnectionSuccess,
      this._handleConnectionError,
    )
  }

  static disconnect () {
    WavesWebSocketService.socket.close()
    WavesWebSocketService.socket = null
    WavesWebSocketService.client = null
  }

}

export default WavesWebSocketService

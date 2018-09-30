/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable global-require */

export const TOKEN_ICONS = {
  ETH: require('./img/icn-ethereum.svg'),
  BTC: require('./img/icn-bitcoin.svg'),
  BCC: require('./img/icn-bitcoin-cash.svg'),
  DASH: require('./img/dash.svg'),
  LTC: require('./img/icn-litecoin.svg'),
  TIME: require('./img/icn-time.svg'),
  LHUS: require('./img/icn-lhus.svg'),
  LHEU: require('./img/icn-lheu.svg'),
  LHAU: require('./img/icn-lhau.svg'),
  XEM: require('./img/icn-xem.svg'),
  XMIN: require('./img/icn-xmin.svg'),
  WAVES: require('./img/waves.svg'),
  DEFAULT: require('assets/img/asset_stub.svg'),
}

export const TX_CONFIRMATIONS = {
  [ 'r_0' ]: require('./img/r-0.svg'),
  [ 'r_1' ]: require('./img/r-25.svg'),
  [ 'r_2' ]: require('./img/r-50.svg'),
  [ 'r_3' ]: require('./img/r-75.svg'),
  [ 'r_4' ]: require('./img/r-100.svg'),
  [ 's_0' ]: require('./img/s-0.svg'),
  [ 's_1' ]: require('./img/s-25.svg'),
  [ 's_2' ]: require('./img/s-50.svg'),
  [ 's_3' ]: require('./img/s-75.svg'),
  [ 's_4' ]: require('./img/s-100.svg'),
}

export const SPINNING_WHEEL = require('./img/spinningwheel-1.gif')

/* eslint-disable global-require */
export default {
  TOKEN_ICONS,
  TX_CONFIRMATIONS,
}

/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_EOS,
  BLOCKCHAIN_LABOR_HOUR,
  LHT,
  BTC,
  BCC,
  DASH,
  LTC,
  ETH,
  XEM,
  WAVES,
  EOS,
} from '@chronobank/login/network/constants'

export const DEFAULT_CBE_URL = '/wallets'
export const DEFAULT_USER_URL = '/wallets'
export const DUCK_SESSION = 'session'
export const GAS_SLIDER_MULTIPLIER_CHANGE = 'session/GAS_SLIDER_MULTIPLIER_CHANGE'
export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'
export const SET_PROFILE_SIGNATURE = 'session/SET_PROFILE_SIGNATURE'
export const SET_WEB3_INSTANCE = 'session/SET_WEB3_INSTANCE'
export const CLEAR_WEB3_INSTANCE = 'session/CLEAR_WEB3_INSTANCE'

export const PROFILE_PANEL_TOKENS = [
  { symbol: BTC, blockchain: BLOCKCHAIN_BITCOIN, title: 'BTC' },
  { symbol: BCC, blockchain: BLOCKCHAIN_BITCOIN_CASH, title: 'BCC' },
  { symbol: DASH, blockchain: BLOCKCHAIN_DASH, title: 'DASH' },
  { symbol: LTC, blockchain: BLOCKCHAIN_LITECOIN, title: 'LTC' },
  { symbol: LHT, blockchain: BLOCKCHAIN_LABOR_HOUR, title: 'LHT' },
  { symbol: ETH, blockchain: BLOCKCHAIN_ETHEREUM, title: 'ETH' },
  { symbol: XEM, blockchain: BLOCKCHAIN_NEM, title: 'NEM' },
  { symbol: WAVES, blockchain: BLOCKCHAIN_WAVES, title: 'WAVES' },
  { symbol: EOS, blockchain: BLOCKCHAIN_EOS, title: 'EOS' },
]

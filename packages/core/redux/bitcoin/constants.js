/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BitcoinCashMemoryDevice from '../../services/signers/BitcoinCashMemoryDevice'
import BitcoinTrezorDevice from '../../services/signers/BitcoinTrezorDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorMockDevice'
import BitcoinLedgerDevice from '../../services/signers/BitcoinLedgerDevice'
import BitcoinLedgerDeviceMock from '../../services/signers/BitcoinLedgerDeviceMock'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'

export const DUCK_BITCOIN = 'bitcoin'
export const TX_UPDATE = 'tx/update'

// coin_types 8, 9, 16, 17 used, but they are not standardized
export const COIN_TYPE_ETH = 60
export const COIN_TYPE_BTC_MAINNET = 0
export const COIN_TYPE_BTC_TESTNET = 1
export const COIN_TYPE_LTC_MAINNET = 9
export const COIN_TYPE_LTC_TESTNET = 8
export const COIN_TYPE_BTG_MAINNET = 17
export const COIN_TYPE_BTG_TESTNET = 16

export const signersMap = {
  'BitcoinCashMemoryDevice': BitcoinCashMemoryDevice,
  'BitcoinMemoryDevice': BitcoinMemoryDevice,
  'BitcoinLedgerDevice': BitcoinLedgerDevice,
  'BitcoinLedgerDeviceMock': BitcoinLedgerDeviceMock,
  'BitcoinTrezorDevice': BitcoinTrezorDevice,
  'BitcoinTrezorDeviceMock': BitcoinTrezorDeviceMock,

}

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// coin_types 8, 9, 16, 17 used, but they are not standardized
export const COIN_TYPE_ETH = 60
export const COIN_TYPE_BTC_MAINNET = 0
export const COIN_TYPE_BTC_TESTNET = 1
export const COIN_TYPE_LTC_MAINNET = 9
export const COIN_TYPE_LTC_TESTNET = 8
// get the first account using the standard hd path
export const WALLET_HD_PATH = `m/44'/${COIN_TYPE_ETH}'/0'/0/0`

/**
 * WARNING!
 * The constants below are duplicated in packages/core/dao/constants.js
 * to make @chronobank/core package indenpendent
*/

export const BCC = 'BCC'
export const BTC = 'BTC'
export const DASH = 'DASH'
export const ETH = 'ETH'
export const LHT = 'LHT'
export const LTC = 'LTC'
export const TIME = 'TIME'
export const WAVES = 'WAVES'
export const XEM = 'XEM'

export const BLOCKCHAIN_BITCOIN = 'Bitcoin'
export const BLOCKCHAIN_BITCOIN_CASH = 'Bitcoin Cash'
export const BLOCKCHAIN_DASH = 'Dash'
export const BLOCKCHAIN_ETHEREUM = 'Ethereum'
export const BLOCKCHAIN_LABOR_HOUR_TOKEN = 'Labor Hour Token'
export const BLOCKCHAIN_LITECOIN = 'Litecoin'
export const BLOCKCHAIN_NEM = 'NEM'
export const BLOCKCHAIN_WAVES = 'WAVES'

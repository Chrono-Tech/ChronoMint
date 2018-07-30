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
export const COIN_TYPE_BTG_MAINNET = 17
export const COIN_TYPE_BTG_TESTNET = 16
// get the first account using the standard hd path
export const WALLET_HD_PATH = `m/44'/${COIN_TYPE_ETH}'/0'/0/0`

export const BLOCKCHAIN_BITCOIN = 'Bitcoin'
export const BLOCKCHAIN_BITCOIN_CASH = 'Bitcoin Cash'
export const BLOCKCHAIN_BITCOIN_GOLD = 'Bitcoin Gold'
export const BLOCKCHAIN_LITECOIN = 'Litecoin'

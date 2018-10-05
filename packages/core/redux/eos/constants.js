/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const DUCK_EOS = 'eos'
export const BLOCKCHAIN_EOS = 'EOS'
export const EOS = 'EOS'

export const EOS_UPDATE = 'EOS/UPDATE'
export const EOS_UPDATE_TOKEN = 'EOS/TOKEN/UPDATE'
export const EOS_UPDATE_WALLET = 'EOS/WALLET/CREATE'
export const TX_CREATE = 'EOS/TX/CREATE'
export const TX_REMOVE = 'EOS/TX/REMOVE'
export const TX_UPDATE = 'EOS/TX/UPDATE'

export const EOS_NETWORK_CONFIG = {
  testnet: {
    httpEndpoint: 'https://api.jungle.alohaeos.com:443', // jungle testnet
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
  },
  mainnet: {
    httpEndpoint: 'https://api.eosdetroit.io:443',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  },
}

export const PAGE_SIZE = 20

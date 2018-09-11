/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as expolorers from './explorers'
import * as middleware from './middleware'

export default {

  // External services
  api_etherscan: expolorers.erc20.api_etherscan,
  bcc_blockdozer: expolorers.bitcoinCash.bcc_blockdozer,
  blockcypher: expolorers.bitcoin.blockcypher,
  blockexplorer: expolorers.bitcoin.blockexplorer,
  btgexplorer: expolorers.bitcoinGold.btgexplorer,
  chain_so: expolorers.litecoin.chain_so,
  etherscan: expolorers.erc20.etherscan,
  live_blockcypher_ltc: expolorers.litecoin.live_blockcypher_ltc,
  rinkeby_etherscan: expolorers.erc20.rinkeby_etherscan,
  tbcc_blockdozer: expolorers.bitcoinCash.tbcc_blockdozer,

  // ChronoWallet middlewares
  middleware_bitcoin_mainnet_rest: middleware.bitcoin.middleware_bitcoin_mainnet_rest,
  middleware_bitcoin_testnet_rest: middleware.bitcoin.middleware_bitcoin_testnet_rest,
  middleware_ethereum_mainnet_rest: middleware.erc20.middleware_ethereum_mainnet_rest,
  middleware_ethereum_testnet_rest: middleware.erc20.middleware_ethereum_testnet_rest,
  middleware_litecoin_mainnet_rest: middleware.litecoin.middleware_litecoin_mainnet_rest,
  middleware_litecoin_testnet_rest: middleware.litecoin.middleware_litecoin_testnet_rest,
  middleware_nem_mainnet_rest: middleware.nem.middleware_nem_mainnet_rest,
  middleware_nem_testnet_rest: middleware.nem.middleware_nem_testnet_rest,
  middleware_waves_mainnet_rest: middleware.waves.middleware_waves_mainnet_rest,
  middleware_waves_testnet_rest: middleware.waves.middleware_waves_testnet_rest,
}

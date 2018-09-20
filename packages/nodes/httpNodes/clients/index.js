/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as expolorers from './explorers'
import * as chronobankNodes from './chronobankNodes'
import * as primaryNodes from './primaryNodes'
import * as otherHosts from './otherHosts'

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

  // ChronoBank middlewares
  middleware_bitcoin_mainnet_rest: chronobankNodes.bitcoin.middleware_bitcoin_mainnet_rest,
  middleware_bitcoin_testnet_rest: chronobankNodes.bitcoin.middleware_bitcoin_testnet_rest,
  middleware_bitcoincash_mainnet_rest: chronobankNodes.bitcoincash.middleware_bitcoincash_mainnet_rest,
  middleware_bitcoincash_testnet_rest: chronobankNodes.bitcoincash.middleware_bitcoincash_testnet_rest,
  middleware_ethereum_mainnet_rest: chronobankNodes.erc20.middleware_ethereum_mainnet_rest,
  middleware_ethereum_testnet_rest: chronobankNodes.erc20.middleware_ethereum_testnet_rest,
  middleware_litecoin_mainnet_rest: chronobankNodes.litecoin.middleware_litecoin_mainnet_rest,
  middleware_litecoin_testnet_rest: chronobankNodes.litecoin.middleware_litecoin_testnet_rest,
  middleware_nem_mainnet_rest: chronobankNodes.nem.middleware_nem_mainnet_rest,
  middleware_nem_testnet_rest: chronobankNodes.nem.middleware_nem_testnet_rest,
  middleware_waves_mainnet_rest: chronobankNodes.waves.middleware_waves_mainnet_rest,
  middleware_waves_testnet_rest: chronobankNodes.waves.middleware_waves_testnet_rest,

  // ChronoBank publick backend
  backend_chronobank:  otherHosts.backend_chronobank,

  // Primary nodes
  mainnet_chronobank: primaryNodes.mainnet_chronobank,
  mainnet_giveth: primaryNodes.mainnet_giveth,
  mainnet_infura: primaryNodes.mainnet_infura,
  mainnet_myetherwallet: primaryNodes.mainnet_myetherwallet,
  testnet_chronobank: primaryNodes.testnet_chronobank,
  testnet_infura: primaryNodes.testnet_infura,
}

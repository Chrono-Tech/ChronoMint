import type BigNumber from 'bignumber.js'
import coinselect from 'coinselect'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'
import {
  COIN_TYPE_BTC_MAINNET,
  COIN_TYPE_BTC_TESTNET, COIN_TYPE_BTG_MAINNET, COIN_TYPE_BTG_TESTNET,
  COIN_TYPE_LTC_MAINNET,
  COIN_TYPE_LTC_TESTNET
} from '@chronobank/login/network/constants'
import { selectBCCNode, selectBTCNode, selectBTGNode, selectLTCNode } from '@chronobank/login/network/BitcoinNode'

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN
} from '../../dao/constants'

export const describeTransaction = (to, amount: BigNumber, feeRate, utxos) => {
  const targets = [
    {
      address: to,
      value: amount.toNumber(),
    },
  ]
  const { inputs, outputs, fee } = coinselect(utxos.map((output) => {
    return {
      txId: output.txid,
      vout: output.vout,
      value: Number.parseInt(output.satoshis),
    }
  }), targets, Math.ceil(feeRate))
  return { inputs, outputs, fee }
}

export const signInputs = (txb, inputs, wallet) => {
  for (let i = 0; i < inputs.length; i++) {
    txb.sign(i, wallet.keyPair)
  }
}

export const signInputsBitcoinGold = (txb, inputs, wallet) => {
  txb.enableBitcoinGold(true)
  txb.setVersion(2)

  const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

  for (let i = 0; i < inputs.length; i++) {
    txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
  }
}

export const signInputsBitcoinCash = (txb, inputs, wallet) => {
  txb.enableBitcoinCash(true)
  txb.setVersion(2)

  const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

  for (let i = 0; i < inputs.length; i++) {
    txb.sign(i, wallet.keyPair, null, hashType, inputs[i].value)
  }
}

export const getEngine = (network, blockchain, privateKey) => {
  let wallet, node
  console.log('getEngine', network, blockchain, privateKey)

  switch (blockchain){
    case BLOCKCHAIN_BITCOIN:
      const bitcoinNetwork = bitcoin.networks[network.bitcoin]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinNetwork)
      node = selectBTCNode(wallet)

      return {
        network: bitcoinNetwork,
        signTransaction: (txb, inputs) => signInputs(txb, inputs, wallet),
        wallet,
        node,
      }
    case BLOCKCHAIN_BITCOIN_CASH:
      const bitcoinCashNetwork = bitcoin.networks[network.bitcoinCash]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinCashNetwork)
      node = selectBCCNode(wallet)

      return {
        network: bitcoinCashNetwork,
        signTransaction: (txb, inputs) => signInputsBitcoinCash(txb, inputs, wallet),
        wallet,
        node,
      }
    case BLOCKCHAIN_BITCOIN_GOLD:
      const bitcoinGoldNetwork = bitcoin.networks[network.bitcoinGold]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinGoldNetwork)
      node = selectBTGNode(wallet)

      return {
        network: bitcoinGoldNetwork,
        signTransaction: (txb, inputs) => signInputsBitcoinGold(txb, inputs, wallet),
        wallet,
        node,
      }
    case BLOCKCHAIN_LITECOIN:
      const litecoinNetwork = bitcoin.networks[network.litecoin]
      wallet = createBitcoinWalletFromPK(privateKey, litecoinNetwork)
      node = selectLTCNode(wallet)

      return {
        network: litecoinNetwork,
        signTransaction: (txb, inputs) => signInputs(txb, inputs, wallet),
        wallet,
        node,
      }
    default:
      return
  }
}

// Method was moved from privateKeyProvider
export const createBitcoinWalletFromPK = (privateKey, network) => {
  console.log('privateKey', privateKey, network, bigi.fromBuffer(Buffer.from(privateKey, 'hex')), Buffer.from(privateKey, 'hex'))
  const keyPair = new bitcoin.ECPair(bigi.fromBuffer(Buffer.from(privateKey, 'hex')), null, {
    network,
  })
  return {
    keyPair,
    getNetwork () {
      return keyPair.getNetwork()
    },
    getAddress () {
      return keyPair.getAddress()
    },
  }
}

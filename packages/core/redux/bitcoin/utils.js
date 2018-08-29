import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import type BigNumber from 'bignumber.js'
import coinselect from 'coinselect'
import bitcoin from 'bitcoinjs-lib'
import {
  selectBCCNode,
  selectBTCNode,
  selectBTGNode,
  selectLTCNode,
} from '@chronobank/login/network/BitcoinNode'

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
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
    txb.sign(i, wallet)
  }
}

export const signInputsBitcoinGold = (txb, inputs, wallet) => {
  txb.enableBitcoinGold(true)
  txb.setVersion(2)

  const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

  for (let i = 0; i < inputs.length; i++) {
    txb.sign(i, wallet, null, hashType, inputs[i].value)
  }
}

export const signInputsBitcoinCash = (txb, inputs, wallet) => {
  txb.enableBitcoinCash(true)
  txb.setVersion(2)

  const hashType = bitcoin.Transaction.SIGHASH_ALL | bitcoin.Transaction.SIGHASH_BITCOINCASHBIP143

  for (let i = 0; i < inputs.length; i++) {
    txb.sign(i, wallet, null, hashType, inputs[i].value)
  }
}

export const getEngine = (network, blockchain, privateKey) => {
  let wallet, node

  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
      const bitcoinNetwork = bitcoin.networks[network.bitcoin]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinNetwork)
      node = selectBTCNode(wallet)

      return {
        network: bitcoinNetwork,
        signTransaction: signInputs,
        wallet,
        node,
      }
    case BLOCKCHAIN_BITCOIN_CASH:
      const bitcoinCashNetwork = bitcoin.networks[network.bitcoinCash]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinCashNetwork)
      node = selectBCCNode(wallet)

      return {
        network: bitcoinCashNetwork,
        signTransaction: signInputsBitcoinCash,
        wallet,
        node,
      }
    case BLOCKCHAIN_BITCOIN_GOLD:
      const bitcoinGoldNetwork = bitcoin.networks[network.bitcoinGold]
      wallet = createBitcoinWalletFromPK(privateKey, bitcoinGoldNetwork)
      node = selectBTGNode(wallet)

      return {
        network: bitcoinGoldNetwork,
        signTransaction: signInputsBitcoinGold,
        wallet,
        node,
      }
    case BLOCKCHAIN_LITECOIN:
      const litecoinNetwork = bitcoin.networks[network.litecoin]
      wallet = createBitcoinWalletFromPK(privateKey, litecoinNetwork)
      node = selectLTCNode(wallet)

      return {
        network: litecoinNetwork,
        signTransaction: signInputs,
        wallet,
        node,
      }
    default:
      return
  }
}

// Method was moved from privateKeyProvider
export const createBitcoinWalletFromPK = (privateKey, network) => {
  const keyPair = new bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), { network })
  return {
    keyPair,
    getNetwork () {
      return keyPair.network
    },
    getAddress () {
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
      return address
    },
  }
}

export const getBtcFee = async (
  {
    address,
    recipient,
    amount,
    formFee,
    blockchain,
  }) => {
  const utxos = await getUtxos(blockchain, address)
  const { fee } = describeTransaction(recipient, amount, formFee, utxos)
  return fee
}

const getNodeByBlockchain = (blockchain) => {
  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
      return btcProvider.getNode()
    case BLOCKCHAIN_BITCOIN_CASH:
      return bccProvider.getNode()
    case BLOCKCHAIN_BITCOIN_GOLD:
      return btgProvider.getNode()
    case BLOCKCHAIN_LITECOIN:
      return ltcProvider.getNode()
  }
  return null
}

/**
 *
 * @param blockchain
 * @param address
 * @returns {Promise<any>}
 */
const getUtxos = (blockchain, address): Promise<any> => {
  const node = getNodeByBlockchain(blockchain)
  if (node) {
    return node.getAddressUTXOS(address)
  }
  return null
}

export const describeBitcoinTransaction = async (to, amount: BigNumber, options) => {
  const { from, feeRate, blockchain, network } = options
  const bitcoinNetwork = bitcoin.networks[network[blockchain]]
  const utxos = await getUtxos(blockchain, from)
  const { inputs, outputs, fee } = describeTransaction(to, amount, feeRate, utxos)

  if (!inputs || !outputs) throw new Error('Bad transaction data')

  const txb = new bitcoin.TransactionBuilder(bitcoinNetwork)
  for (const input of inputs) {
    txb.addInput(input.txId, input.vout)
  }

  for (const output of outputs) {
    if (!output.address) {
      output.address = from
    }
    txb.addOutput(output.address, output.value)
  }

  return {
    tx: txb,
    fee,
  }
}

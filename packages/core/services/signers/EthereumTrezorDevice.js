/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EthereumTx from 'ethereumjs-tx'
import hdkey from 'ethereumjs-wallet/hdkey'
import TrezorConnect from 'trezor-connect'
import { omitBy, isNil } from 'lodash'
import Web3Utils from 'web3-utils'

const DEFAULT_PATH = "m/44'/60'/0'/0"
const DEFAULT_PATH_FACTORY = (index) => `${DEFAULT_PATH}/${index}`

export default class EthereumTrezorDevice {

  constructor () {
    this.xPubKey = null
  }

  get name () {
    return 'trezor'
  }

  get title () {
    return 'Trezor Device'
  }

  async getXpubkey () {
    // @todo add negative case
    if (!this.xPubKey) {
      const result = await TrezorConnect.getPublicKey({ path: DEFAULT_PATH })
      console.log('this.xPubKey result: ', result)
      const { xpub } = result.payload
      this.xPubKey = xpub
    }
    console.log('getXpubkey: ', this.xPubKey)

    return this.xPubKey
  }

  async getAddress (path) {
    console.log('getAddress TrezorDevice: ')
    const xPubKey = await this.getXpubkey()
    const hdKey = hdkey.fromExtendedKey(xPubKey)
    console.log('hdKey: ', hdKey, path)

    console.log('Result: ', hdKey.deriveChild(0).getWallet())

    const wallet = hdKey.deriveChild(0).getWallet()
    console.log('wallet: ', wallet)
    return `0x${wallet.getAddress().toString('hex')}`
  }

  async getAccountInfoList (from: number = 0, limit: number = 5): String {

    const xpubKey = this.getXpubkey()
    console.log('getAddressInfoList: ', xpubKey)

    const hdKey = hdkey.fromExtendedKey(xpubKey)
    return Array.from({ length: limit }).map((element, index) => {
      const wallet = hdKey.deriveChild(from + index).getWallet()
      return {
        path: DEFAULT_PATH_FACTORY(index),
        address: `0x${wallet.getAddress().toString('hex')}`,
        xpubkey: xpubKey,
        type: this.name,
      }
    })
  }

  async signTransaction (txData, path) {
    // Encode using ethereumjs-tx
    const tx = new EthereumTx({
      ...txData,
      ...omitBy(
        {
          value:
            txData.value == null // nil check
              ? null
              : Web3Utils.toBN(txData.value),
          fee:
            txData.fee == null // nil check
              ? null
              : Web3Utils.toBN(txData.fee),
          gasLimit:
            txData.gasLimit == null // nil check
              ? null
              : Web3Utils.toBN(txData.gasLimit),
          gasPrice:
            txData.gasPrice == null // nil check
              ? null
              : Web3Utils.toBN(txData.gasPrice),
          nonce:
            txData.nonce == null // nil check
              ? null
              : Web3Utils.toBN(txData.nonce),
        },
        isNil
      ),
    })

    const chainId = txData.chainId
    const response = await TrezorConnect.ethereumSignTransaction({
      path: path,
      transaction: {
        nonce: txData.nonce.toString(16),
        gasPrice: txData.gasPrice.toString(16),
        gasLimit: txData.gasLimit.toString(16),
        to: txData.to,
        value: txData.value.toString(16),
        data: txData.data == null ? '' : txData.data,
        chainId: chainId,
      },
    })

    if (response.success) {
      // Store signature in transaction
      tx.v = response.payload.v
      tx.r = response.payload.r
      tx.s = response.payload.s

      // EIP155: v should be chain_id * 2 + {35, 36}
      const signedChainId = Math.floor((tx.v[0] - 35) / 2)
      if (signedChainId !== chainId) {
        throw new Error('Invalid signature received.')
      }

      // Return the signed raw transaction
      const rawTx = '0x' + tx.serialize().toString('hex')
      return {
        rawTransaction: rawTx,
      }
    }
  }

  async signData (data, path) {
    const response = await TrezorConnect
      .ethereumSignMessage({ path: path, message: Buffer.from(data).toString('hex') })
    if (response.success) {
      return {
        signature: `0x${response.payload.signature}`,
      }
    }
  }

}

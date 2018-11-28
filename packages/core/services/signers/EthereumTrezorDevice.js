/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EthereumTx from 'ethereumjs-tx'
import hdkey from 'ethereumjs-wallet/hdkey'
import TrezorConnect from 'trezor-connect'
import { omitBy, isNil } from 'lodash'
import Web3Utils from 'web3-utils'
import TrezorError from '../errors/TrezorError'

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

  async getXpubkey (path) {
    if (!this.xPubKey) {
      console.log('getXpubkey: TrezorConnect.getPublicKey: before: ', path, this)
      const result = await TrezorConnect.getPublicKey({ path: path })
      if (!result.success) {
        throw new TrezorError(result.code, result.payload.error)
      }

      const { xpub } = result.payload
      this.xPubKey = xpub
    }

    return this.xPubKey
  }

  async getAddress (path) {
    const xPubKey = await this.getXpubkey(path)
    const hdKey = hdkey.fromExtendedKey(xPubKey)
    const wallet = hdKey.deriveChild(0).getWallet()

    return `0x${wallet.getAddress().toString('hex')}`
  }

  async getAccountInfoList (from: number = 0, limit: number = 5): String {
    const xpubKey = await this.getXpubkey(DEFAULT_PATH)
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

import EventEmitter from 'events'
import hdkey from 'ethereumjs-wallet/hdkey'
import { TrezorConnect } from 'connect/connect'

const DEFAULT_PATH = "44'/60'/0'/0"
const DEFAULT_PATH_FACTORY = (index) => `${DEFAULT_PATH}/${index}`

export default class TrezorDevice extends EventEmitter {
  get name () {
    return 'trezor'
  }

  get title () {
    return 'Trezor Device'
  }

  async init () {
    TrezorConnect.getXPubKey(DEFAULT_PATH, response => {
      const { xpubkey, publicKey, success } = response
      if (success) {
        this.xpubkey = xpubkey
        const wallet = hdkey.fromExtendedKey(this.xpubkey).getWallet()
        this.emit('connected')
        return {
          path: DEFAULT_PATH,
          address: wallet.getAddress().toString('hex'),
          publicKey
        }
      }
    })
  }

  get isConnected () {
    return !!this.xpubkey
  }

  async getAddressInfoList (from: Number = 0, limit: Number = 5): String {
    if (this.isConnected) {
      const hdKey = hdkey.fromExtendedKey(this.xpubkey)
      return Array.from({ length: limit }).map((element, index) => {
        const wallet = hdKey.deriveChild(from + index).getWallet()
        return {
          path: DEFAULT_PATH_FACTORY(index),
          address: `0x${wallet.getAddress().toString('hex')}`,
          publicKey: wallet.getPublicKey().toString('hex')
        }
      })
    }
    return []
  }

  async signTransaction (path, txData) {
    console.log('[TrezorDevice] signTransaction')
    throw new Error('Not implemented')
  }

  async signData (path, data) {
    console.log('[TrezorDevice] signData', path, data)
    throw new Error('Not implemented')
  }
}

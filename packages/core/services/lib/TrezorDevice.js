import EventEmitter from 'events'
import EthereumTx from 'ethereumjs-tx'
import hdkey from 'ethereumjs-wallet/hdkey'
import { TrezorConnect } from './connect'

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
    return this._safeExec(
      async () => {
        // Encode using ethereumjs-tx
        let tx = new EthereumTx(txData);

        chain_id = txData.chainId;
        TrezorConnect.ethereumSignTx(
            path,
            stripAndPad(txData.nonce),
            stripAndPad(txData.gasPrice),
            stripAndPad(txData.gas),
            stripAndPad(txData.to),
            stripAndPad(txData.value),
            stripAndPad(txData.data),
            chain_id,
            function (response) {
             if (response.success) {
                    // Store signature in transaction
                    tx.v = '0x' + new BigNumber(response.v).toString(16);
                    tx.r = '0x' + response.r;
                    tx.s = '0x' + response.s;

                    // EIP155: v should be chain_id * 2 + {35, 36}
                    const signed_chain_id = Math.floor((tx.v[0] - 35) / 2);
                    if (signed_chain_id !== chain_id) {
                        throw new Error("Invalid signature received.");
                    }

                    // Return the signed raw transaction
                    const rawTx = "0x" + tx.serialize().toString("hex");
		    return rawTx;
             } else {
                 throw new Error(response.error); // error message
             }
         });
    }) 
  }

  async signData (path, data) {
    return this._safeExec(
      async () => {
         TrezorConnect.ethereumSignMessage(self.path, stripHexPrefix(msgData.data)).then(response => {
	      if (response.success) {
                 const v = parseInt(result.v, 10) - 27;
                 let vHex = v.toString(16);
                 if (vHex.length < 2) {
                   vHex = `0${v}`;
                 }
                 return `0x${result.r}${result.s}${vHex}`;
		}
		else {
                 throw new Error(response.error); // error message
		}
      })
    })
  }
}

import Wallet from 'ethereumjs-wallet'
import {toBuffer} from 'ethereumjs-util'

const PrivateKeyProvider = (privateKey: string) => {
  return Wallet.fromPrivateKey(toBuffer(privateKey))
}
export default PrivateKeyProvider

import BigNumber from 'bignumber.js'
import bs58 from 'bs58'
import web3utils from 'web3/lib/utils/utils'

const unitMap = {
  wei: 1000000000000000000,
  gwei: 1000000000,
}

class Web3Converter {
  // from utils as is
  hexToDecimal = web3utils.toDecimal
  bytesToString = web3utils.toUtf8
  stringToBytes = web3utils.fromUtf8

  /**
   * @param n
   * @param isToWei
   * @param unit
   * @private
   */
  _weiConvert (n: BigNumber, isToWei: boolean = true, unit: string): BigNumber {
    if (n === null) {
      return n
    }
    // convert old web3's BigNumber to new version
    const newBigNumber = new BigNumber(typeof n === 'object' ? n.toFixed() : n)

    return newBigNumber[ isToWei ? 'times' : 'dividedBy' ](unitMap[ unit ])
  }

  /**
   * web3.fromWei & web3.toWei not working properly in all browsers.
   * So you should use this function and...
   * @see toWei instead
   * @param n
   * @param unit
   */
  fromWei (n: BigNumber, unit: string = 'wei'): BigNumber {
    return this._weiConvert(n, false, unit)
  }

  /**
   * @link https://github.com/ethereum/web3.js/blob/master/lib/utils/utils.js
   * @see fromWei
   * @param n
   * @param unit
   */
  toWei (n: BigNumber, unit: string = 'wei'): BigNumber {
    return this._weiConvert(n, true, unit)
  }

  /**
   * @param bytes
   * @returns {string}
   */
  bytes32ToIPFSHash (bytes) {
    if (/^0x0{63}[01]$/.test(`${bytes}`)) {
      return ''
    }
    const str = Buffer.from(bytes.replace(/^0x/, '1220'), 'hex')
    // noinspection JSUnresolvedFunction
    return bs58.encode(str)
  }

  /**
   * @param value
   * @returns {string}
   */
  ipfsHashToBytes32 (value) {
    // noinspection JSUnresolvedFunction
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  }

  stringToBytesWithZeros (string) {
    const zeros = '000000000000000000000000000000000000000000000000000000000000000000'
    return `${this.stringToBytes(string)}${zeros}`.substr(0, 66)
  }
}

export default new Web3Converter()

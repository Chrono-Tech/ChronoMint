import web3utils from 'web3/lib/utils/utils'
import bs58 from 'bs58'

class Web3Converter {
  /**
   * web3.fromWei & web3.toWei not working properly in all browsers.
   * So you should use this function and...
   * @see toWei instead.
   * @param n
   * @returns {number}
   */
  fromWei (n: number) {
    return n / 1000000000000000000
  }

  /**
   * @see fromWei
   * @param n
   * @returns {number}
   */
  toWei (n: number) {
    return n * 1000000000000000000
  }

  /**
   * @param bytes
   * @returns {string}
   */
  bytesToString (bytes) {
    return web3utils.toUtf8(bytes)
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
    return bs58.encode(str)
  }

  /**
   * @param value
   * @returns {string}
   */
  ipfsHashToBytes32 (value) {
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  }

  /**
   * @param value
   * @returns {string}
   */
  toBytes32 (value) {
    let zeros = '000000000000000000000000000000000000000000000000000000000000000'
    if (typeof value === 'string') {
      return ('0x' + [].reduce.call(value, (hex, c) => {
        return hex + c.charCodeAt(0).toString(16)
      }, '') + zeros).substr(0, 66)
    }
    let hexNumber = value.toString(16)
    return '0x' + (zeros + hexNumber).substring(hexNumber.length - 1)
  }

  /**
   * @param hex
   * @returns {String}
   */
  toDecimal (hex: string) {
    return web3utils.toDecimal(hex)
  }
}

export default new Web3Converter()

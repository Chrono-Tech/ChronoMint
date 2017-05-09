import web3utils from 'web3/lib/utils/utils'
import bs58 from 'bs58'

function fromWei (n: number) {
  return n / 1000000000000000000
}

function toWei (n: number) {
  return n * 1000000000000000000
}

/**
 * @param bytes
 * @return {string}
 **/
function bytesToString (bytes) {
  return web3utils.toUtf8(bytes)
}

/**
 * @param bytes
 * @return {string}
 * @protected
 */
function bytes32ToIPFSHash (bytes) {
  if (/^0x0{63}[01]$/.test(`${bytes}`)) {
    return ''
  }
  const str = Buffer.from(bytes.replace(/^0x/, '1220'), 'hex')
  return bs58.encode(str)
}

/**
 * @param value
 * @return {string}
 * @protected
 */
function ipfsHashToBytes32 (value) {
  return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
}

/**
 * @param value
 * @return {string}
 * @protected
 */
function toBytes32 (value) {
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
 * @param address
 * @return {boolean}
 * @protected
 */
function isEmptyAddress (address: string) {
  return address === '0x0000000000000000000000000000000000000000'
}

function toDecimal (hex: string) {
  return web3utils.toDecimal(hex)
}

export default {
  fromWei,
  toWei,
  bytesToString,
  bytes32ToIPFSHash,
  ipfsHashToBytes32,
  toBytes32,
  isEmptyAddress,
  toDecimal
}

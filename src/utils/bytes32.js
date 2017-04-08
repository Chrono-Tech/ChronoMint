function bytes32 (stringOrNumber) {
  let zeros = '000000000000000000000000000000000000000000000000000000000000000'
  if (typeof stringOrNumber === 'string') {
    return ('0x' + [].reduce.call(stringOrNumber, (hex, c) => {
      return hex + c.charCodeAt(0).toString(16)
    }, '') + zeros).substr(0, 66)
  }
  let hexNumber = stringOrNumber.toString(16)
  return '0x' + (zeros + hexNumber).substring(hexNumber.length - 1)
}

const hex2ascii = (hexx) => {
  let hex = hexx.toString()
  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
    let code = parseInt(hex.substr(i, 2), 16)
    str += code ? String.fromCharCode(code) : ''
  }
  return str
}

module.exports = {bytes32, hex2ascii}

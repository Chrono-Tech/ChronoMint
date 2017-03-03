function bytes32(stringOrNumber) { // TODO File is duplicated with test/helpers/bytes32.js
  var zeros = '000000000000000000000000000000000000000000000000000000000000000';
  if (typeof stringOrNumber === "string") {
    return (web3.toHex(stringOrNumber) + zeros).substr(0, 66);
  }
  var hexNumber = stringOrNumber.toString(16);
  return '0x' + (zeros + hexNumber).substring(hexNumber.length - 1);
}

module.exports = bytes32;
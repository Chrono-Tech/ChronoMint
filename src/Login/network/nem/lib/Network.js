/** @module utils/Network */

/**
* Networks info data
*
* @type {object}
*/
const data = {
  "Mainnet": {
    "id": 104,
    "prefix": "68",
    "char": "N",
  },
  "Testnet": {
    "id": -104,
    "prefix": "98",
    "char": "T",
  },
  "Mijin": {
    "id": 96,
    "prefix": "60",
    "char": "M",
  },
}

/**
 * Gets a network prefix from network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The network prefix
 */
let id2Prefix = function (id) {
  if (id === 104) {
    return "68"
  } else if (id === -104) {
    return "98"
  } else {
    return "60"
  }
}

/**
 * Gets the starting char of the addresses of a network id
 *
 * @param {number} id - A network id
 *
 * @return {string} - The starting char of addresses
 */
let id2Char = function (id) {
  if (id === 104) {
    return "N"
  } else if (id === -104) {
    return "T"
  } else {
    return "M"
  }
}

/**
 * Gets the network id from the starting char of an address
 *
 * @param {string} startChar - A starting char from an address
 *
 * @return {number} - The network id
 */
let char2Id = function (startChar) {
  if (startChar === "N") {
    return 104
  } else if (startChar === "T") {
    return -104
  } else {
    return 96
  }
}

export default {
  data,
  id2Prefix,
  id2Char,
  char2Id,
}

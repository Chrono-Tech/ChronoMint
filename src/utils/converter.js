import Web3 from 'web3'

const web3 = new Web3()

export const toAscii = web3.toAscii

/**
 * From wei to ether.
 * web3.fromWei is not working properly in all browsers, so you should use this function to convert your wei value.
 * @param n
 * @returns {number}
 */
export function weiToEther (n: number) {
  return n / 1000000000000000000
}

export function etherToWei (n: number) {
  return n * 1000000000000000000
}

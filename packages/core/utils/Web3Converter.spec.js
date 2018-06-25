/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3Converter from './Web3Converter'

describe('web3 converter', () => {
  it.skip('should convert to ether', () => {
    let ether = Web3Converter.fromWei('96820460646994890000')
    expect(ether).toEqual('96.82046064699489')

    ether = Web3Converter.fromWei(96820460646994890000)
    expect(ether).toEqual(96.82046064699489)

    ether = Web3Converter.fromWei(96820460646994580000)
    expect(ether).toEqual(96.82046064699458)
  })
})

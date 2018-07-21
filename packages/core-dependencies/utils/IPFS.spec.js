/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ipfsAPI from 'ipfs-api'
import IPFS from './IPFS'

describe('IPFS DAO', () => {
  const value = { name: `id${Math.random()}` }

  it('should initialize IPFS', () => {
    const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    expect(JSON.stringify(IPFS.getAPI())).toEqual(JSON.stringify(ipfs))
  })

  it('should put and get value', () => IPFS.put(value).then((hash) => {
    IPFS.get(hash).then((result) => {
      expect(result).toEqual(value)
    })
  }))
})

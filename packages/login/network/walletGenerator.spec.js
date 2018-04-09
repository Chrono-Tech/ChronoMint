/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import walletGenerator from './walletGenerator'

describe('wallet generator', () => {
  it('should generate different wallets', async () => {
    const wallet1 = await walletGenerator.getWallet('123')
    const wallet2 = await walletGenerator.getWallet('123')
    expect(wallet1).not.toEqual(wallet2)
  })
})

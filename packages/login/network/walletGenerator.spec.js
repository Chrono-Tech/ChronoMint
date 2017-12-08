import walletGenerator from './walletGenerator'

describe('wallet generator', () => {
  it('should generate different wallets', async () => {
    const wallet1 = await walletGenerator.getWallet('123')
    const wallet2 = await walletGenerator.getWallet('123')
    expect(wallet1).not.toEqual(wallet2)
  })
})

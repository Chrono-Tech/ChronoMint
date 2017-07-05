import walletGenerator from '../../src/network/walletGenerator'

describe('wallet generator', () =>{
  it('should generate different wallets', async () => {
    const wallet1 = await walletGenerator('123')
    const wallet2 = await walletGenerator('123')
    expect(wallet1).not.toEqual(wallet2)
  })
})

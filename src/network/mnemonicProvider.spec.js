import mnemonicProvider from './mnemonicProvider'

describe('mnemonic provider', () => {
  it('should create wallet from mnemonic', () => {
    return Promise.resolve(mnemonicProvider('some mnemonic')).then((wallet) => {
      expect(wallet).toBeTruthy()
    })
  })
})

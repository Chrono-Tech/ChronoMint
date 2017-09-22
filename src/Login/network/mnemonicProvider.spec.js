import mnemonicProvider from './mnemonicProvider'

describe('mnemonic provider', () => {
  it('should create wallet from mnemonic', async () => {
    const wallet = await mnemonicProvider.getMnemonicProvider('some mnemonic')
    expect(wallet).toBeTruthy()
    expect(wallet.ethereum).toBeTruthy()
  })

  it('should validate mnemonic', () => {
    const isValid = mnemonicProvider.validateMnemonic('siege guess school summer below person bargain rack pass dismiss enable ripple')
    expect(isValid).toBeTruthy()
  })

  it('should validate mnemonic', () => {
    const isValid = mnemonicProvider.validateMnemonic('123')
    expect(isValid).toBeFalsy()
  })
})

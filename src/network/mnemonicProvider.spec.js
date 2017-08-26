import mnemonicProvider, { validateMnemonic } from './mnemonicProvider'

describe('mnemonic provider', () => {
  it('should create wallet from mnemonic', async () => {
    const wallet = await mnemonicProvider('some mnemonic')
    expect(wallet).toBeTruthy()
    expect(wallet.ethereum).toBeTruthy()
    expect(wallet.bitcoin).toBeTruthy()
  })

  it('should validate mnemonic', () => {
    const isValid = validateMnemonic('siege guess school summer below person bargain rack pass dismiss enable ripple')
    expect(isValid).toBeTruthy()
  })

  it('should validate mnemonic', () => {
    const isValid = validateMnemonic('123')
    expect(isValid).toBeFalsy()
  })
})

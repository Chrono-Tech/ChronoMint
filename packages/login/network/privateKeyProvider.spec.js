import privateKeyProvider from './privateKeyProvider'

describe('mnemonic provider', () => {
  it('should create wallet from privateKey', async () => {
    const wallet = await privateKeyProvider.getPrivateKeyProvider('54e91ad69f389310dfa888b785f4a7e0700cd300bf4f9e3f303afd2024cc413b')
    expect(wallet).toBeTruthy()
    expect(wallet.ethereum).toBeTruthy()
    expect(wallet.bitcoin).toBeFalsy()
  })

  it('should validate private key', () => {
    const isValid = privateKeyProvider.validatePrivateKey('54e91ad69f389310dfa888b785f4a7e0700cd300bf4f9e3f303afd2024cc413b')
    expect(isValid).toBeTruthy()
  })

  it('should validate not validate private key', () => {
    const isValid = privateKeyProvider.validatePrivateKey('123')
    expect(isValid).toBeFalsy()
  })
})

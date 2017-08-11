import privateKeyProvider, { validatePrivateKey } from './privateKeyProvider'

describe('mnemonic provider', () => {
  it('should create wallet from privateKey', async () => {
    const wallet = await privateKeyProvider('54e91ad69f389310dfa888b785f4a7e0700cd300bf4f9e3f303afd2024cc413b')
    expect(wallet).toBeTruthy()
  })

  it('should validate private key', () => {
    const isValid = validatePrivateKey('54e91ad69f389310dfa888b785f4a7e0700cd300bf4f9e3f303afd2024cc413b')
    expect(isValid).toBeTruthy()
  })

  it('should validate not validate private key', () => {
    const isValid = validatePrivateKey('123')
    expect(isValid).toBeFalsy()
  })
})

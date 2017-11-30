import WalletModel from './WalletModel'
import OwnerModel from './OwnerModel'

const ADDRESS = '0x1234567890123456789012345678901234567899'
const WALLET_NAME = 'Test Wallet'
const DAY_LIMIT = 777
const REQUIRED_SIGNATURES = 2

describe('Wallet model', () => {
  let walletModel = null

  it('should construct and return data', () => {
    walletModel = new WalletModel({
      isNew: false,
      walletName: WALLET_NAME,
      dayLimit: DAY_LIMIT,
      requiredSignatures: REQUIRED_SIGNATURES,
    })
  })

  it('should get walletName', () => {
    expect(walletModel.walletName()).toEqual(WALLET_NAME)
  })

  it('should get dayLimit', () => {
    expect(walletModel.dayLimit()).toEqual(DAY_LIMIT)
  })

  it('should get requiredSignatures', () => {
    expect(walletModel.requiredSignatures()).toEqual(REQUIRED_SIGNATURES)
  })

  it('should get owners before adding', () => {
    expect(walletModel.owners().toArray().length).toEqual(0)
  })

  it('should add owner', () => {
    walletModel = walletModel.addOwner(new OwnerModel({
      address: ADDRESS,
      editing: true,
    }))
  })

  it('should get one owner', () => {
    expect(walletModel.owners().toArray().length).toEqual(1)
  })

})

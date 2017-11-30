import OwnerModel from './OwnerModel'

describe('Owner model', () => {
  const ADDRESS = '0x1234567890123456789012345678901234567890'
  let ownerModel = null

  it('should construct and return data', () => {
    ownerModel = new OwnerModel({
      address: ADDRESS,
      editing: true,
    })
  })

  it('should get address', () => {
    expect(ownerModel.address()).toEqual(ADDRESS)
  })

  it('should get editing', () => {
    expect(ownerModel.editing()).toEqual(true)
  })

})

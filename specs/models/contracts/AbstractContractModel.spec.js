import AbstractContractModel from '../../../src/models/contracts/AbstractContractModel'

describe('abstract contract model', () => {
  it('should not construct class', () => {
    expect(() => {
      const contract = new AbstractContractModel()
      contract.name()
    }).toThrow(new TypeError('Cannot construct AbstractContractModel instance directly'))
  })
})

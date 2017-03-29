import AbstractOtherContractModel, {validate} from '../../../src/models/contracts/AbstractOtherContractModel'

describe('abstract other contract model', () => {
  it('should not construct class', () => {
    expect(() => {
      const contract = new AbstractOtherContractModel()
      contract.name()
    }).toThrow(new TypeError('Cannot construct AbstractOtherContractModel instance directly'))
  })

  it('should validate', () => {
    const values = new Map()
    values.set('address', '0xfc20893b53d186d89da816e507353e04209f9fc4')
    expect(validate(values)).toEqual({
      'address': null
    })
  })

  it('should have unavailable/empty interface methods', () => {
    class OtherContractModel extends AbstractOtherContractModel {}
    const model = new OtherContractModel('blah')
    expect(model.address()).toEqual('blah')
    expect(() => {
      model.dao().then()
    }).toThrow(new Error('should be overridden'))

    expect(model.form()).toEqual(null)
  })
})

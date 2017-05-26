import validator, { onlyFirstErrors } from '../../src/utils/validator'

describe('forms validator', () => {
  it('should validate ethereum address', () => {
    expect(validator.isAddress('0x88615f19b8db1a47c0af7950a5fecf719c915f3a')).toEqual(true)
    expect(validator.isAddress('abc')).toEqual(false)
    expect(validator.isAddress('')).toEqual(false)
    expect(validator.isAddress('0x')).toEqual(false)
    expect(validator.isAddress('0x2a65aca4d5fc5b5c859090a6c34d164135398226')).toEqual(true)
    expect(validator.isAddress('0x2A65ACA4D5FC5D5C859090A6C34D164135398226')).toEqual(true)
  })

  it('should validate positive integer value', () => {
    expect(validator.isPositiveInt(123)).toEqual(true)
    expect(validator.isPositiveInt(0)).toEqual(false)
    expect(validator.isPositiveInt(-1)).toEqual(false)
    expect(validator.isPositiveInt('939294')).toEqual(true)
  })

  it('should return only first errors', () => {
    const errors = onlyFirstErrors({
      name: ['First error', 'Second error'],
      lastName: 'First error',
      parents: {
        mom: {
          name: ['First error', 'Second error']
        },
        correct: ['First error', 'Second error']
      }
    })

    expect(errors.name).toEqual('First error')
    expect(errors.lastName).toEqual('First error')
    expect(errors.parents.mom.name).toEqual('First error')
    expect(errors.parents.correct).toEqual('First error')
  })
})

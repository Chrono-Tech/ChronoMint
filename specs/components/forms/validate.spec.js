import validator from '../../../src/components/forms/validator'

describe('forms validator', () => {
  it('should validator ethereum address', () => {
    expect(validator.address('0x88615f19b8db1a47c0af7950a5fecf719c915f3a')).toEqual(null)
    expect(validator.address('abc')).not.toEqual(null)
    expect(validator.address('')).not.toEqual(null)
    expect(validator.address('', false)).toEqual(null)
  })

  it('should validator name', () => {
    expect(validator.name('abc')).toEqual(null)
    expect(validator.name('ab')).not.toEqual(null)
    expect(validator.name('')).not.toEqual(null)
    expect(validator.name('', false)).toEqual(null)
  })

  it('should validator address', () => {
    expect(validator.address('')).not.toEqual(null)
    expect(validator.address('0x')).not.toEqual(null)

    expect(validator.address('0x2a65aca4d5fc5b5c859090a6c34d164135398226')).toEqual(null)
    expect(validator.address('0x2A65ACA4D5FC5D5C859090A6C34D164135398226')).toEqual(null)
  })

  it('should validator email', () => {
    expect(validator.email('info@chronobank.io')).toEqual(null)
    expect(validator.email('chronobank.io')).not.toEqual(null)
    expect(validator.email('')).not.toEqual(null)
    expect(validator.email('', false)).toEqual(null)
  })

  it('should validator positive integer value', () => {
    expect(validator.positiveInt(123)).toEqual(null)
    expect(validator.positiveInt(0)).not.toEqual(null)
    expect(validator.positiveInt(-1)).not.toEqual(null)
    expect(validator.positiveInt('939294')).toEqual(null)
  })
})

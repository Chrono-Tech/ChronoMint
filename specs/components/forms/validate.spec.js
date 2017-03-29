import * as validate from '../../../src/components/forms/validate'

describe('forms validate', () => {
  it('should validate ethereum address', () => {
    expect(validate.address('0x88615f19b8db1a47c0af7950a5fecf719c915f3a')).toEqual(null)
    expect(validate.address('abc')).not.toEqual(null)
    expect(validate.address('')).not.toEqual(null)
    expect(validate.address('', false)).toEqual(null)
  })

  it('should validate name', () => {
    expect(validate.name('abc')).toEqual(null)
    expect(validate.name('ab')).not.toEqual(null)
    expect(validate.name('')).not.toEqual(null)
    expect(validate.name('', false)).toEqual(null)
  })

  it('should validate email', () => {
    expect(validate.email('info@chronobank.io')).toEqual(null)
    expect(validate.email('chronobank.io')).not.toEqual(null)
    expect(validate.email('')).not.toEqual(null)
    expect(validate.email('', false)).toEqual(null)
  })

  it('should validate positive integer value', () => {
    expect(validate.positiveInt(123)).toEqual(null)
    expect(validate.positiveInt(0)).not.toEqual(null)
    expect(validate.positiveInt(-1)).not.toEqual(null)
    expect(validate.positiveInt('939294')).toEqual(null)
  })
})

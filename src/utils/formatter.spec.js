import { integerWithDelimiter } from './formatter'

const SPACE = '\u00a0'

describe('value formatter', () => {
  it('should parse base types', () => {
    expect(integerWithDelimiter(0)).toEqual('0')
    expect(integerWithDelimiter(NaN)).toEqual('0')
    expect(integerWithDelimiter(null)).toEqual('0')
    expect(integerWithDelimiter(undefined)).toEqual('0')
    expect(integerWithDelimiter('')).toEqual('0')
  })

  it('should parse values and render without fraction', () => {
    expect(integerWithDelimiter(1)).toEqual('1')
    expect(integerWithDelimiter(1.11)).toEqual('1')
    expect(integerWithDelimiter(12)).toEqual('12')
    expect(integerWithDelimiter(123)).toEqual('123')
    expect(integerWithDelimiter(1234)).toEqual(`1${SPACE}234`)
    expect(integerWithDelimiter(123456)).toEqual(`123${SPACE}456`)
    expect(integerWithDelimiter(1234567)).toEqual(`1${SPACE}234${SPACE}567`)
    expect(integerWithDelimiter(1234567.123)).toEqual(`1${SPACE}234${SPACE}567`)
    expect(integerWithDelimiter('1234567.123')).toEqual(`1${SPACE}234${SPACE}567`)
  })

  it('should parse values and render with fraction', () => {
    expect(integerWithDelimiter(0, true)).toEqual('0.00')
    expect(integerWithDelimiter(0.5, true)).toEqual('0.50')
    expect(integerWithDelimiter(0.05, true)).toEqual('0.05')
    expect(integerWithDelimiter(0.005, true)).toEqual('0.01')
    expect(integerWithDelimiter(0.004, true)).toEqual('0.00')
    expect(integerWithDelimiter(1, true)).toEqual('1.00')
    expect(integerWithDelimiter(1.9, true)).toEqual('1.90')
    expect(integerWithDelimiter(1.99, true)).toEqual('1.99')
    expect(integerWithDelimiter(12.99, true)).toEqual('12.99')
    expect(integerWithDelimiter(123.99, true)).toEqual('123.99')
    expect(integerWithDelimiter(1234.99, true)).toEqual(`1${SPACE}234.99`)
    expect(integerWithDelimiter(123456.99, true)).toEqual(`123${SPACE}456.99`)
    expect(integerWithDelimiter(1234567.99, true)).toEqual(`1${SPACE}234${SPACE}567.99`)
    expect(integerWithDelimiter('1234567.99', true)).toEqual(`1${SPACE}234${SPACE}567.99`)
    expect(integerWithDelimiter('1234567.9999', true)).toEqual(`1${SPACE}234${SPACE}568.00`)
  })
})

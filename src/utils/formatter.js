import BigNumber from 'bignumber.js'

/**
 * Convert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * \u00a0 = &nbsp;
 */
export function integerWithDelimiter (value: any, withFraction = false): string {
  const valueBN = new BigNumber(value || 0)
  if (valueBN.isZero() || valueBN.isNaN()) {
    return withFraction ? '0.00' : '0'
  }

  if (withFraction) {
    return valueBN.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1\u00a0')
  }
  const roundedValue = valueBN.lt(0) ? valueBN.ceil() : valueBN.floor()
  const sign = valueBN.lt(0) ? '-' : ''
  return sign + roundedValue.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
}

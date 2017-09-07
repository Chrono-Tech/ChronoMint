import type BigNumber from 'bignumber.js'

/**
 * Convert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * \u00a0 = &nbsp;
 */
export function integerWithDelimiter (value: BigNumber, withFraction = false): string {
  if (value.isZero()) {
    return withFraction ? '0.00' : '0'
  }

  if (withFraction) {
    return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1\u00a0')
  } else {
    const roundedValue = value.lt(0) ? value.ceil() : value.floor()
    const sign = value.lt(0) ? '-': ''
    return sign + roundedValue.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
  }
}

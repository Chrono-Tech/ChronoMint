/**
 * Convert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * \u00a0 = &nbsp;
 */
export function integerWithDelimiter (value: number, withFraction = false): string {
  if (!value || (typeof value === 'object' && isNaN(value.toNumber()))) {
    return withFraction ? '0.00' : '0'
  }
  return withFraction
    ? (+value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1\u00a0')
    : Math.floor(+value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
}

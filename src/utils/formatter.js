/**
 * Convert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 */
export function integerWithDelimiter (value: number, withFraction = false): string {
  if (!value || (typeof value === 'object' && isNaN(value.toNumber()))) {
    return 0
  }
  const fixedValue = withFraction ? (+value).toFixed(2) : Math.floor(+value).toFixed(0)
  // \u00a0 = &nbsp;
  return fixedValue.replace(/(\d)(?=(\d{3})+\.)/g, '$1\u00a0')
}

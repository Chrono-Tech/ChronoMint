/**
 * Covert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * @param value
 * @return {string}
 */
export function integerWithDelimiter (value: number) {
  // \u00a0 = &nbsp;
  const r = Math.floor(+value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
  if (isNaN(r)) {
    return 0
  }
  return r
}

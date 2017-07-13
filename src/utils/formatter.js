/**
 * Covert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * @param value
 * @return {string}
 */
export function integerWithDelimiter (value: number) {
  if(!value) {
    return 0
  }
  // \u00a0 = &nbsp;
  return Math.floor(+value).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
}

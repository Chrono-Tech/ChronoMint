/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'

/**
 * Convert number 24123432 into string '24 123 432' with nbsp-spaces.
 * Useful in renders
 * \u00a0 = &nbsp;
 */
// eslint-disable-next-line import/prefer-default-export
export function integerWithDelimiter (value: any, withFraction = false, fractionPrecision = 2): string {
  //TODO @abdulov, check after release a new version of BigNumber
  // issue https://github.com/MikeMcl/bignumber.js/issues/148
  const valueBN = new BigNumber(value.toString() || 0)
  if (valueBN.isZero() || valueBN.isNaN()) {
    return withFraction ? '0.00' : '0'
  }

  if (withFraction) {
    return valueBN.toFixed(fractionPrecision).replace(/(\d)(?=(\d{3})+\.)/g, '$1\u00a0')
  }
  const roundedValue = valueBN.lt(0) ? valueBN.ceil() : valueBN.floor()
  const sign = valueBN.lt(0) ? '-' : ''
  return sign + roundedValue.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1\u00a0')
}

export function deepSortByKey (obj) {
  return Object.keys(obj).sort().reduce((acc, key) => {
    if (Array.isArray(obj[key])) {
      acc[key] = obj[key].map(deepSortByKey)
    } else if (typeof obj[key] === 'object') {
      acc[key] = deepSortByKey(obj[key])
    } else {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

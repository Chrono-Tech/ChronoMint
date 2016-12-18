import React, { Component, PropTypes } from 'react'
import numeral from 'numeral'
import moment from 'moment'

export const NumberFormatBasic = ({val}) => (
  <span>{basicNumberFormat(val, 0)}</span>
);

export const NumberFormatDecimal = ({val}) => (
  <span>{basicNumberFormat(val, 2)}</span>
);

export const currency = (val, symbol='€') => (
  `${symbol}${numeral(val).format('0,0[.]0')}`
)

function basicNumberFormat(num, precision=0) {
  if(precision !== 0) {
    return numeral(num).format('0,0[.]0')
  }
  return numeral(num).format('0,0')
}

export const date = (val, format='DD-MMM-YYYY') => (
  moment(val).format(format)
)
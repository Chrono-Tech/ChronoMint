/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'
import LogTxModel from './describers/LogTxModel'
import LogEventModel from './describers/LogEventModel'

const schemaFactory = () => ({
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  historyKey: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(PropTypes.string),
  cursor: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.instanceOf(LogEventModel),
    PropTypes.instanceOf(LogTxModel),
  ])),
})

export default class LogListModel extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      isLoading: false,
      isLoaded: false,
      address: null,
      historyKey: null,
      cursor: null,
      topics: [],
      entries: [],
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }

  loading () {
    return new LogListModel({
      ...this,
      isLoading: true,
    })
  }

  loaded ({ cursor, entries }) {
    return new LogListModel({
      ...this,
      isLoading: false,
      isLoaded: true,
      cursor,
      entries,
    })
  }

  updated ({ cursor, entries }) {
    return new LogListModel({
      ...this,
      cursor,
      entries,
    })
  }
}

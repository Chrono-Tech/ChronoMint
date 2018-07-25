/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import PropTypes from 'prop-types'
import AbstractModel from '../../refactor/models/AbstractModel'

const schemaFactory = () => ({
  key: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.object),
  lastBlock: PropTypes.number,
  cache: PropTypes.any,
})

export default class TxHistoryModel extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      key: uuid(),
      isLoading: false,
      isLoaded: false,
      blocks: [],
      lastBlock: null,
      firstBlock: null,
      cache: {},
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }

  loaded ({ blocks, firstBlock }) {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      isLoaded: true,
      isLoading: false,
      blocks,
      firstBlock,
    })
  }

  withCachedTxDesc ({ desc }) {
    return new TxHistoryModel({
      ...this,
      cache: {
        ...this.cache,
        [desc.hash]: desc,
      },
    })
  }

  updated ({ blocks, lastBlock, firstBlock }) {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      blocks,
      lastBlock,
      firstBlock,
    })
  }

  get transactions () {
    const array = []
    for (const block of this.blocks) {
      array.push(...block.transactions)
    }
    return array
  }

  loading () {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      isLoading: true,
    })
  }
}

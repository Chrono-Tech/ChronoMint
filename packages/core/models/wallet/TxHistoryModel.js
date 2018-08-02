/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  key: PropTypes.string,
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  blocks: PropTypes.objectOf(PropTypes.object),
  lastBlock: PropTypes.number,
  cache: PropTypes.any,
})

export default class TxHistoryModel extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      key: uuid(),
      isLoading: false,
      isLoaded: false,
      blocks: {},
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
    const txList = {}
    Object.entries(this.blocks)
      .map(([, block]) => {
        block.transactions.map((tx) => {
          txList[tx.id()] = tx
        })
      })
    return Object.values(txList)
  }

  loading () {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      isLoading: true,
    })
  }

  transform () {
    return { ...this }
  }
}

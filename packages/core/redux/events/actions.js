/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { padStart, unionBy, uniq, sortBy } from 'lodash'
import { describeEvent, describeTx } from '../../describers'
import { selectDuckSession } from '../session/selectors/session'
import { getHistoryKey } from '../../utils/eventHistory'

import { web3Selector } from '../ethereum/selectors'
import { eventsSelector } from './selectors'
import EventsHistory from '../../services/EventsService'
import { getTokens } from '../tokens/selectors'

import {
  EVENTS_LOGS_LOADED,
  EVENTS_LOGS_LOADING,
  EVENTS_LOGS_UPDATED,
  ADD_EVENT_TO_HISTORY,
} from './constants'

export const watchEventsToHistory = () => async (dispatch, getState) => {

  EventsHistory.on(ADD_EVENT_TO_HISTORY, (event) => {
    const allHistory = eventsSelector()(getState())
    const topic = event.raw.topics[0]

    Object.entries(allHistory).forEach(([, history]) => {
      const isTopicsExists = history.topics.some((t) => t === topic)
      if (!isTopicsExists) {
        return
      }

      dispatch(pushEvent(history.historyKey, { ...event, data: event.raw.data, topics: event.raw.topics }))
    })
  })
}

export const pushTx = (historyKey, receipt) => async (dispatch, getState) => {
  {
    const state = getState()
    const web3 = web3Selector()(state)
    const allHistory = eventsSelector()(state)

    const [tx, block] = await Promise.all([
      web3.eth.getTransaction(receipt.transactionHash),
      web3.eth.getBlock(receipt.blockHash)
    ])

    const desciption = describeTx(
      { tx, receipt, block }
    )

    const entries = Array.isArray(desciption)
      ? desciption
      : [desciption]

    const actualHistory = allHistory[historyKey]

    dispatch({
      type: EVENTS_LOGS_UPDATED,
      historyKey,
      cursor: actualHistory
        ? actualHistory.cursor
        : null,
      entries: actualHistory
        ? [...entries, ...actualHistory.entries]
        : [...entries],
    })
  }
}

export const pushEvent = (historyKey, log) => async (dispatch, getState) => {

  const state = getState()
  const web3 = web3Selector()(state)
  const allHistory = eventsSelector()(state)
  const { account } = selectDuckSession(state)

  const [tx, receipt, block] = await Promise.all([
    web3.eth.getTransaction(log.transactionHash),
    web3.eth.getTransactionReceipt(log.transactionHash),
    web3.eth.getBlock(log.blockHash)
  ])

  const desciption = describeEvent(
    { log, tx, receipt, block: block || { timestamp: +new Date() } }
  )

  const entries = Array.isArray(desciption)
    ? desciption
    : [desciption]

  const actualHistory = allHistory[historyKey]

  dispatch({
    type: EVENTS_LOGS_UPDATED,
    address: account,
    historyKey,
    cursor: actualHistory
      ? actualHistory.cursor
      : null,
    entries: actualHistory
      ? [...entries, ...actualHistory.entries]
      : [...entries],
  })
}

// eslint-disable-next-line complexity
export const loadEvents = (topics = null, ofAddress: string = null, blockScanLimit = 100000, logScanLimit = 10) => async (dispatch, getState) => {

  const state = getState()
  const web3 = web3Selector()(state)
  const { account } = selectDuckSession(state)
  const address = ofAddress ? ofAddress.toLowerCase() : account
  const historyKey = getHistoryKey(topics, address)

  await dispatch({
    type: EVENTS_LOGS_LOADING,
    address,
    historyKey,
    topics,
  })

  const allHistory = eventsSelector()(state)
  const history = allHistory[historyKey]

  const toBlock = await web3.eth.getBlock(
    history.cursor == null ? 'latest' : Math.max(0, history.cursor - 1)
  )

  let fromBlock = await web3.eth.getBlock(
    Math.max(0, toBlock.number - blockScanLimit)
  )

  const topic = `0x${padStart(address.substring(2), 64, 0)}`

  const [logs1, logs2, logs3] = await Promise.all(
    [1, 2, 3].map(
      (number) => {
        const topicsArray = Array.from({ length: number + 1 }).map((n, i) => number === i ? topic : null)
        topicsArray[0] = topics
        return web3.eth.getPastLogs({
          toBlock: `0x${Number(toBlock.number).toString(16)}`,
          fromBlock: `0x${Number(fromBlock.number).toString(16)}`,
          topics: topicsArray,
        })
      }
    )
  )

  let logs = unionBy(
    logs1,
    logs2,
    logs3,
    (entry) => `${entry.blockHash}-${entry.transactionIndex}-${entry.logIndex}`
  ).sort((log1, log2) => {
    const blockDiff = log2.blockNumber - log1.blockNumber
    if (blockDiff !== 0) {
      return blockDiff
    }
    const indexDiff = log2.logIndex - log1.logIndex
    return indexDiff
  })

  if (logs.length > logScanLimit) {
    let index = logScanLimit
    const blockNumber = logs[logScanLimit - 1].blockNumber
    while (logs[index].blockNumber === blockNumber) {
      index++
    }
    logs = logs.slice(0, index)
    //eslint-disable-next-line
    console.warn(`[events] Two many events, skips all after the event number ${index}`)
  }

  if (logs.length === 0) {
    dispatch({
      type: EVENTS_LOGS_LOADED,
      historyKey,
      address,
      entries: history.entries,
    })

    return
  }

  fromBlock = await web3.eth.getBlock(
    logs[logs.length - 1].blockHash
  )

  const blocks = await Promise.all(
    uniq(logs.map((entry) => entry.blockHash))
      .map((blockHash) => web3.eth.getBlock(blockHash))
  )

  const blocksMap = blocks.reduce(
    (target, block) => {
      target[block.hash] = block
      return target
    },
    {}
  )

  const transactions = await Promise.all(
    uniq(logs.map((entry) => entry.transactionHash), (transactionHash) => transactionHash)
      .map((transactionHash) => web3.eth.getTransaction(transactionHash))
  )

  const transactionsMap = transactions.reduce(
    (target, tx) => {
      target[tx.hash] = tx
      return target
    },
    {}
  )

  const receipts = await Promise.all(
    transactions.map((tx) => web3.eth.getTransactionReceipt(tx.hash))
  )

  const receiptsMap = receipts.reduce(
    (target, receipt) => {
      target[receipt.transactionHash] = receipt
      return target
    },
    {}
  )

  const tree = []
  for (const log of logs) {
    const tx = transactionsMap[log.transactionHash]
    const receipt = receiptsMap[log.transactionHash]
    const block = blocksMap[log.blockHash]

    const blockTree = tree[block.hash] = tree[block.hash] || { block, transactions: {} }
    const txTree = blockTree.transactions[tx.hash] = blockTree.transactions[tx.hash] || { tx, receipt, logs: [] }

    txTree.logs.push(log)
  }

  const entries = []

  const store = {
    tokens: getTokens(getState())
  }

  for (const { block, transactions } of sortBy(Object.values(tree), (v) => -v.block.timestamp)) {
    for (const { tx, receipt, logs } of Object.values(transactions)) {
      const context = {
        address,
        store,
      }

      for (const log of logs) {
        const description = describeEvent({ log, tx, receipt, block }, context)
        if (Array.isArray(description)) {
          entries.push(...description)
        } else {
          entries.push(description)
        }
      }

      if (tx.from.toLowerCase() === address || tx.to.toLowerCase() === address) {
        const description = describeTx({ tx, receipt, block }, context)
        if (Array.isArray(description)) {
          entries.push(...description)
        } else {
          entries.push(description)
        }
      }
    }
  }

  dispatch({
    type: EVENTS_LOGS_LOADED,
    historyKey,
    address,
    cursor: fromBlock.number,
    entries: history
      ? [...history.entries, ...entries]
      : entries,
  })
}

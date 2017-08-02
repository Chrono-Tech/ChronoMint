import Immutable from 'immutable'
import reducer, { initialState } from './reducer'
import * as a from './actions'
import TxExecModel from 'models/TxExecModel'

const tx = new TxExecModel({id: 123, func: 'test'})
const txWithGas = tx.setGas(5000)

let map = new Immutable.Map()
map = map.set(tx.id(), tx)

const mapWithGas = map.set(tx.id(), txWithGas)

const emptyTx = new TxExecModel()

describe('watcher reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer({...initialState, confirmTx: emptyTx}, {})
    ).toEqual({
      pendingTxs: new Immutable.Map(),
      confirmTx: new TxExecModel({id: emptyTx.id()})
    })
  })

  it('should handle WATCHER_TX_START', () => {
    expect(
      reducer({pendingTxs: new Immutable.Map()}, {type: a.WATCHER_TX_SET, tx})
    ).toEqual({
      pendingTxs: map,
      confirmTx: tx
    })
  })

  it('should handle WATCHER_TX_SET', () => {
    expect(
      reducer({pendingTxs: map}, {type: a.WATCHER_TX_SET, tx: txWithGas})
    ).toEqual({
      pendingTxs: mapWithGas,
      confirmTx: txWithGas
    })
  })

  it('should handle WATCHER_TX_END', () => {
    expect(
      reducer({pendingTxs: mapWithGas}, {type: a.WATCHER_TX_END, tx})
    ).toEqual({
      pendingTxs: new Immutable.Map()
    })
  })
})

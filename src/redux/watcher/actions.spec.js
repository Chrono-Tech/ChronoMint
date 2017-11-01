import Immutable from 'immutable'
import { mockStore } from 'specsInit'
import * as actions from './actions'

let store

const mock = new Immutable.Map({
  market: {
    lastMarket: {},
    rates: {},
  },
})

describe('watcher actions', () => {
  beforeEach(() => {
    store = mockStore(mock)
  })

  it('should dispatch watcher', async () => {
    await store.dispatch(actions.watcher())
    expect(store.getActions()).toContainEqual({ type: actions.WATCHER })
  })

  it('should dispatch cbeWatcher', async () => {
    await store.dispatch(actions.cbeWatcher())
    expect(store.getActions()).toEqual([{ type: actions.WATCHER_CBE }])
  })
})

import Immutable from 'immutable'
import { accounts, mockStore } from 'specsInit'
import * as actions from './actions'

let store

const mock = new Immutable.Map({
  market: {
    lastMarket: {},
    rates: {},
  },
  session: {
    account: accounts[0],
  },
})

describe('watcher actions', () => {
  beforeEach(() => {
    store = mockStore(mock)
  })

  it('should dispatch watcher', async () => {
    await store.dispatch(actions.watcher())
    expect(store.getActions()).toMatchSnapshot()
  })

  it('should dispatch cbeWatcher', async () => {
    await store.dispatch(actions.cbeWatcher())
    expect(store.getActions()).toMatchSnapshot()
  })
})

import { store, mockStore } from 'specsInit'
import * as a from './action'
import Immutable from 'immutable'

describe('Market actions', () => {
  it('should init market watcher', () => {
    const mock = mockStore(
      new Immutable.Map({
        market: {
          'currencies': ['USD'],
          'isInited': false,
          'lastMarket': {},
          'prices': {},
          'rates': {},
          'selectedCoin': 'ETH',
          'selectedCurrency': 'USD',
          'tokens': ['ETH', 'TIME']
        }
      })
    )
    mock.dispatch(a.watchInitMarket())

    expect(mock.getActions()).toEqual([
      {type: a.MARKET_INIT, isInited: true}
    ])
    expect(a.timerId).not.toBeNull()
    clearInterval(a.timerId)
  })

  it('should stop market watcher', () => {
    store.dispatch(a.watchStopMarket())
    expect(store.getActions()).toEqual([
      {type: a.MARKET_INIT, isInited: false}
    ])
  })

  it('should add token to watcher', () => {
    store.dispatch(a.addMarketToken('FAKE'))
    expect(store.getActions()).toEqual([
      {type: a.MARKET_ADD_TOKEN, symbol: 'FAKE'}
    ])
  })
})

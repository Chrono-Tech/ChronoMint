import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {List, Map} from 'immutable'
import reducer, * as actions from '../../../src/redux/lhStory/lhStory'

const mockStore = configureMockStore([thunk])
let store = null
const toBlock = Math.random()

let list = new List()
list = list.set(0, 'Abc')
list = list.set(1, 'Xyz')

describe('lhStory', () => {
  beforeEach(() => {
    store = mockStore()
    window.localStorage.clear()
  })

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(actions.initialState)
  })

  it('should handle LH_STORY_LIST', () => {
    expect(
      reducer([], {type: actions.LH_STORY_LIST, list})
    ).toEqual({
      list
    })
  })

  it('should handle LH_STORY_TRANSACTIONS_FETCH', () => {
    expect(
      reducer(actions.initialState, {type: actions.LH_STORY_TRANSACTIONS_FETCH})
    ).toEqual({
      ...actions.initialState,
      isFetching: true
    })
  })

  it('should handle LH_STORY_TRANSACTIONS', () => {
    expect(
      reducer(actions.initialState, {type: actions.LH_STORY_TRANSACTIONS, map: new Map(), toBlock})
    ).toEqual({
      ...actions.initialState,
      isFetching: false,
      toBlock
    })
  })

  it('should list lh story', () => {
    store.dispatch(actions.listStory())
    expect(store.getActions()).toEqual([
      {type: actions.LH_STORY_LIST, list: store.getActions()[0].list}
    ])
  })

  it('should load lh transactios', () => {
    store.dispatch(actions.getLHTransactions('all', toBlock))
    expect(store.getActions()).toEqual([
      { 'type': actions.LH_STORY_TRANSACTIONS_FETCH }
    ])
  })

  it('should load lh transactios', () => {
    store.dispatch(actions.getLHTransactions('all', toBlock))
    expect(require('../../../src/redux/lhStory').lhStory).toEqual(reducer)
  })
})

import Immutable from 'immutable'
import TokenModel from 'models/TokenModel'
import * as a from './actions'
import reducer from './reducer'

const token = new TokenModel({ address: '0x123', symbol: 'TIME' })

let list = new Immutable.Map()
list = list.set(token.id(), token)

describe('settings erc20 reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      list: new Immutable.Map(),
      selected: new TokenModel(),
      formFetching: false,
      isFetched: false,
    })
  })

  it('should handle TOKENS_LIST', () => {
    expect(reducer([], { type: a.TOKENS_LIST, list })).toEqual({
      list,
      isFetched: true,
    })
  })

  it('should handle TOKENS_FORM', () => {
    expect(reducer([], { type: a.TOKENS_FORM, token })).toEqual({
      selected: token,
    })

    expect(reducer([], { type: a.TOKENS_FORM_FETCH, end: true })).toEqual({
      formFetching: false,
    })
  })

  it('should handle TOKENS_FORM_FETCH', () => {
    expect(reducer([], { type: a.TOKENS_FORM_FETCH })).toEqual({
      formFetching: true,
    })

    expect(reducer([], { type: a.TOKENS_FORM_FETCH, end: true })).toEqual({
      formFetching: false,
    })
  })

  it('should handle TOKENS_SET', () => {
    expect(reducer({ list: new Immutable.Map() }, { type: a.TOKENS_SET, token })).toEqual({
      list,
    })
  })

  it('should handle TOKENS_REMOVE', () => {
    expect(reducer({ list }, { type: a.TOKENS_REMOVE, token })).toEqual({
      list: new Immutable.Map(),
    })
  })
})

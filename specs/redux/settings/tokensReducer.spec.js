import { Map } from 'immutable'
import reducer, * as a from '../../../src/redux/settings/tokens'
import TokenContractModel from '../../../src/models/contracts/TokenContractModel'

const token = new TokenContractModel({address: '0x123', symbol: 'TIME'})
let list = new Map()
list = list.set(token.address(), token)

describe('settings tokens reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      list: new Map(),
      selected: new TokenContractModel(),
      balances: new Map(),
      balancesNum: 0,
      balancesPageCount: 0,
      error: false,
      isFetched: false,
      isFetching: false,
      isRemove: false
    })
  })

  it('should handle TOKENS_LIST', () => {
    expect(
      reducer([], {type: a.TOKENS_LIST, list})
    ).toEqual({
      list,
      isFetched: true
    })
  })

  it('should handle TOKENS_VIEW', () => {
    expect(
      reducer([], {type: a.TOKENS_VIEW, token})
    ).toEqual({
      selected: token
    })
  })

  it('should handle TOKENS_FORM', () => {
    expect(
      reducer([], {type: a.TOKENS_FORM, token})
    ).toEqual({
      selected: token
    })
  })

  it('should handle TOKENS_BALANCES_NUM', () => {
    expect(
      reducer([], {type: a.TOKENS_BALANCES_NUM, num: 180, pages: 2})
    ).toEqual({
      balancesNum: 180,
      balancesPageCount: 2
    })
  })

  it('should handle TOKENS_BALANCES', () => {
    let balances = new Map()
    balances = balances.set('0x321', 1000)
    expect(
      reducer([], {type: a.TOKENS_BALANCES, balances})
    ).toEqual({
      balances
    })
  })

  it('should handle TOKENS_UPDATE', () => {
    expect(
      reducer({list: new Map()}, {type: a.TOKENS_UPDATE, token})
    ).toEqual({
      list
    })
  })

  it('should handle TOKENS_REMOVE_TOGGLE', () => {
    expect(
      reducer([], {type: a.TOKENS_REMOVE_TOGGLE, token})
    ).toEqual({
      selected: token,
      isRemove: true
    })

    expect(
      reducer({selected: token, isRemove: true}, {type: a.TOKENS_REMOVE_TOGGLE, token: null})
    ).toEqual({
      selected: new TokenContractModel(),
      isRemove: false
    })
  })

  it('should handle TOKENS_REMOVE', () => {
    expect(
      reducer({list}, {type: a.TOKENS_REMOVE, token})
    ).toEqual({
      list: new Map()
    })
  })

  it('should handle TOKENS_ERROR', () => {
    expect(
      reducer([], {type: a.TOKENS_ERROR, address: token.address()})
    ).toEqual({
      error: token.address()
    })
  })

  it('should handle TOKENS_HIDE_ERROR', () => {
    expect(
      reducer([], {type: a.TOKENS_HIDE_ERROR})
    ).toEqual({
      error: false
    })
  })

  it('should handle TOKENS_FETCH_START', () => {
    expect(
      reducer([], {type: a.TOKENS_FETCH_START})
    ).toEqual({
      isFetching: true
    })
  })

  it('should handle TOKENS_FETCH_END', () => {
    expect(
      reducer([], {type: a.TOKENS_FETCH_END})
    ).toEqual({
      isFetching: false
    })
  })
})

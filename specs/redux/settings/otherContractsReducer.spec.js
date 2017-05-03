import { Map } from 'immutable'
import reducer, * as a from '../../../src/redux/settings/otherContracts'
import DefaultContractModel from '../../../src/models/contracts/RewardsContractModel'

let contract = new DefaultContractModel({address: '0x123', name: 'Test'})
let list = new Map()
list = list.set(contract.address(), contract)

describe('settings other contracts reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      list: new Map(),
      selected: new DefaultContractModel(),
      error: false,
      isReady: false,
      isFetching: false,
      isRemove: false
    })
  })

  it('should handle OTHER_CONTRACTS_LIST', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_LIST, list})
    ).toEqual({
      list,
      isReady: true
    })
  })

  it('should handle OTHER_CONTRACTS_FORM', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_FORM, contract})
    ).toEqual({
      selected: contract
    })
  })

  it('should handle OTHER_CONTRACTS_UPDATE', () => {
    expect(
      reducer({list: new Map()}, {type: a.OTHER_CONTRACTS_UPDATE, contract})
    ).toEqual({
      list
    })
  })

  it('should handle OTHER_CONTRACTS_REMOVE', () => {
    expect(
      reducer({list}, {type: a.OTHER_CONTRACTS_REMOVE, contract})
    ).toEqual({
      list: new Map()
    })
  })

  it('should handle OTHER_CONTRACTS_REMOVE_TOGGLE', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_REMOVE_TOGGLE, contract})
    ).toEqual({
      selected: contract,
      isRemove: true
    })

    expect(
      reducer({selected: contract}, {type: a.OTHER_CONTRACTS_REMOVE_TOGGLE, contract: null})
    ).toEqual({
      selected: new DefaultContractModel(),
      isRemove: false
    })
  })

  it('should handle OTHER_CONTRACTS_ERROR', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_ERROR, address: contract.address()})
    ).toEqual({
      error: contract.address()
    })
  })

  it('should handle OTHER_CONTRACTS_HIDE_ERROR', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_HIDE_ERROR})
    ).toEqual({
      error: false
    })
  })

  it('should handle OTHER_CONTRACTS_FETCH_START', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_FETCH_START})
    ).toEqual({
      isFetching: true
    })
  })

  it('should handle OTHER_CONTRACTS_FETCH_END', () => {
    expect(
      reducer([], {type: a.OTHER_CONTRACTS_FETCH_END})
    ).toEqual({
      isFetching: false
    })
  })
})

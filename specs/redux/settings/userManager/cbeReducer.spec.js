import { Map } from 'immutable'
// import reducer, * as a from '../../../../src/redux/settings/userManager/cbe'
import CBEModel from '../../../../src/models/CBEModel'

let cbe = new CBEModel({address: '0x123', name: 'Test'})

let list = new Map()
list = list.set(cbe.address(), cbe)





// TODO @dkchv: write new





describe('settings cbe reducer', () => {
  it.skip('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      list: new Map(),
      selected: new CBEModel(),
      isFetched: false,
      isFetching: false,
      isRemove: false
    })
  })

  it.skip('should handle CBE_LIST', () => {
    expect(
      reducer([], {type: a.CBE_LIST, list})
    ).toEqual({
      list,
      isFetching: false,
      isFetched: true
    })
  })

  it.skip('should handle CBE_FORM', () => {
    expect(
      reducer([], {type: a.CBE_FORM, cbe})
    ).toEqual({
      selected: cbe
    })
  })

  it.skip('should handle CBE_REMOVE_TOGGLE', () => {
    expect(a.removeCBEToggle(cbe)).toEqual({type: a.CBE_REMOVE_TOGGLE, cbe})

    expect(
      reducer([], a.removeCBEToggle(cbe))
    ).toEqual({
      selected: cbe,
      isRemove: true
    })

    expect(
      reducer({selected: cbe}, a.removeCBEToggle(null))
    ).toEqual({
      selected: new CBEModel(),
      isRemove: false
    })
  })

  it.skip('should handle CBE_UPDATE', () => {
    expect(
      reducer({list: new Map()}, {type: a.CBE_UPDATE, cbe})
    ).toEqual({
      list
    })
  })

  it.skip('should handle CBE_REMOVE', () => {
    expect(
      reducer({list}, {type: a.CBE_REMOVE, cbe})
    ).toEqual({
      list: new Map()
    })
  })

  it.skip('should handle CBE_LIST_FETCH', () => {
    expect(
      reducer([], {type: a.CBE_LIST_FETCH})
    ).toEqual({
      isFetching: true
    })
  })
})

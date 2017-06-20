import { Map } from 'immutable'
import reducer from '../../../src/redux/operations/reducer'
import * as a from '../../../src/redux/operations/actions'
import OperationModel from '../../../src/models/OperationModel'

let list = new Map()
let list2 = new Map()
const operation = new OperationModel({id: 'hash', isConfirmed: true, remained: 1})
list = list.set(operation.originId(), operation)
list2 = list2.set('test', new OperationModel({id: 'test'}))

describe('operations', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      isFetching: false,
      isFetched: false,
      list: new Map(),
      required: null,
      adminCount: null,
      completedEndOfList: false
    })
  })

  it('should handle OPERATIONS_FETCH', () => {
    expect(
      reducer([], {type: a.OPERATIONS_FETCH})
    ).toEqual({
      isFetching: true
    })
  })

  it('should handle OPERATIONS_LIST', () => {
    expect(
      reducer([], {type: a.OPERATIONS_LIST, list, fromBlock: 10})
    ).toEqual({
      list,
      isFetching: false,
      isFetched: true,
      completedEndOfList: false
    })

    expect(
      reducer(
        {isFetched: true, list},
        {type: a.OPERATIONS_LIST, list: list2, fromBlock: 10}
      )
    ).toEqual({
      list: list.merge(list2),
      isFetching: false,
      isFetched: true,
      completedEndOfList: false
    })
  })

  it('should handle OPERATIONS_UPDATE', () => {
    expect(
      reducer({list: new Map()}, {type: a.OPERATIONS_UPDATE, operation})
    ).toEqual({
      list
    })

    expect(
      reducer({list}, {type: a.OPERATIONS_UPDATE, operation: operation.set('remained', 0)})
    ).toEqual({
      list: new Map()
    })
  })

  it('should handle OPERATIONS_UPDATE', () => {
    expect(
      reducer([], {type: a.OPERATIONS_SIGNS_REQUIRED, required: 5})
    ).toEqual({
      required: 5
    })
  })

  it('should handle OPERATIONS_UPDATE', () => {
    expect(
      reducer([], {type: a.OPERATIONS_ADMIN_COUNT, adminCount: 8})
    ).toEqual({
      adminCount: 8
    })
  })
})

import { Map } from 'immutable'
import reducer, * as a from '../../../src/redux/notifier/notifier'
import UserDAO from '../../../src/dao/UserDAO'
import CBEModel from '../../../src/models/CBEModel'
import CBENoticeModel from '../../../src/models/notices/CBENoticeModel'
import { store } from '../../init'

const accounts = UserDAO.web3.eth.accounts
const cbe = new CBEModel({address: accounts[1]})
const notice = new CBENoticeModel({revoke: false, cbe})
let list = new Map()
list = list.set(notice.id(), notice)

describe('notifier', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      notice: null,
      list: new Map()
    })
  })

  it('should handle NOTIFIER_MESSAGE', () => {
    expect(
      reducer([], {type: a.NOTIFIER_MESSAGE, notice})
    ).toEqual({
      notice
    })
  })

  it('should handle NOTIFIER_LIST', () => {
    expect(
      reducer([], {type: a.NOTIFIER_LIST, list})
    ).toEqual({
      list
    })
  })

  it('should handle NOTIFIER_CLOSE', () => {
    expect(
      reducer([], {type: a.NOTIFIER_CLOSE})
    ).toEqual({
      notice: null
    })
  })

  it('should notify, save notice in local storage and return list from this storage', () => {
    store.dispatch(a.notify(notice))
    expect(store.getActions()).toEqual([
      {type: a.NOTIFIER_MESSAGE, notice},
      {type: a.NOTIFIER_LIST, list}
    ])
  })

  it('should create an action to close notifier', () => {
    expect(a.closeNotifier()).toEqual({type: a.NOTIFIER_CLOSE})
  })
})

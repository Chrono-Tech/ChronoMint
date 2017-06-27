import Immutable from 'immutable'
import CBEModel from '../../../src/models/CBEModel'
import CBENoticeModel from '../../../src/models/notices/CBENoticeModel'
import reducer, * as a from '../../../src/redux/notifier/notifier'
import { store, accounts } from '../../init'

const cbe = new CBEModel({address: accounts[1]})
const notice = new CBENoticeModel({revoke: false, cbe})

describe('notifier', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      notice: null,
      list: new Immutable.List()
    })
  })

  it('should handle NOTIFIER_MESSAGE', () => {
    expect(
      reducer({list: new Immutable.List()}, {type: a.NOTIFIER_MESSAGE, notice, isStorable: true})
    ).toEqual({
      notice,
      list: new Immutable.List([notice])
    })

    expect(
      reducer({list: new Immutable.List()}, {type: a.NOTIFIER_MESSAGE, notice, isStorable: false})
    ).toEqual({
      notice,
      list: new Immutable.List()
    })
  })

  it('should handle NOTIFIER_CLOSE', () => {
    expect(
      reducer([], {type: a.NOTIFIER_CLOSE})
    ).toEqual({
      notice: null
    })
  })

  it('should notify', () => {
    store.dispatch(a.notify(notice))
    expect(store.getActions()).toEqual([
      {type: a.NOTIFIER_MESSAGE, notice, isStorable: true}
    ])
  })

  it('should create an action to close notifier', () => {
    expect(a.closeNotifier()).toEqual({type: a.NOTIFIER_CLOSE})
  })
})

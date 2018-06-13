/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { store, accounts } from 'specsInit'
import CBEModel from '../../models/CBEModel'
import CBENoticeModel from '../../models/notices/CBENoticeModel'
import * as a from './actions'

const cbe = new CBEModel({ address: accounts[1] })
const notice = new CBENoticeModel({ revoke: false, cbe })

describe('notifier', () => {
  it('should notify', () => {
    store.dispatch(a.notify(notice))
    expect(store.getActions()).toEqual([
      { type: a.NOTIFIER_MESSAGE, notice, isStorable: true },
    ])
  })

  it('should create an action to close notifier', () => {
    expect(a.closeNotifier()).toEqual({ type: a.NOTIFIER_CLOSE })
  })
})

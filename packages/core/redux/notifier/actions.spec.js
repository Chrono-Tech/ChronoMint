/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { store } from 'specsInit'
import * as a from './actions'

const notice = {}

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

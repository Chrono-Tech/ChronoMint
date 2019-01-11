/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import * as a from './actions'
import reducer from './reducer'

const notice = {}

describe('notifier', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      notice: null,
      list: new Immutable.List(),
      unreadNotices: 0,
    })
  })

  it('should handle NOTIFIER_MESSAGE', () => {
    expect(reducer({ list: new Immutable.List() }, { type: a.NOTIFIER_MESSAGE, notice, isStorable: true })).toEqual({
      notice,
      list: new Immutable.List([notice]),
      unreadNotices: 1,
    })

    expect(reducer({ list: new Immutable.List() }, { type: a.NOTIFIER_MESSAGE, notice, isStorable: false })).toEqual({
      notice,
      list: new Immutable.List(),
      unreadNotices: 0,
    })
  })

  it('should handle NOTIFIER_READ', () => {
    expect(reducer({ unreadNotices: 3 }, { type: a.NOTIFIER_READ })).toEqual({
      unreadNotices: 0,
    })
  })

  it('should handle NOTIFIER_CLOSE', () => {
    expect(reducer([], { type: a.NOTIFIER_CLOSE })).toEqual({
      notice: null,
    })
  })
})

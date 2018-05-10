/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { store } from 'specsInit'
import * as actions from 'redux/sides/actions'

describe('sides actions', () => {
  ['sidesPush', 'sidesOpen'].forEach((name) => {
    it(`should open side by ${name} action`, async () => {
      await store.dispatch(actions[name]({
        component: null,
        panelKey: 'test_key',
        isOpened: false,
      }))
      expect(store.getActions()[0].type).toEqual(actions.SIDES_PUSH)
      expect(store.getActions()[0].panelKey).toEqual('test_key')
      expect(store.getActions()[0].isOpened).toEqual(false)
    })
  });

  ['sidesClose', 'sidesPop'].forEach((name) => {
    it(`should close a side panel by ${name} action`, async () => {
      await store.dispatch(actions[name]('test_key'))
      expect(store.getActions()[0].type).toEqual(actions.SIDES_POP)
    })
  })

  it('should close all side panels by modalsClear action', async () => {
    await store.dispatch(actions.sidesClear())
    expect(store.getActions()[0].type).toEqual(actions.SIDES_CLEAR)
  })
})

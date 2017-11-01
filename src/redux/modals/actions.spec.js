import { store } from 'specsInit'

import * as actions from 'redux/modals/actions'

describe('modals actions', () => {
  ['modalsOpen', 'modalsShow', 'modalsPush'].forEach((name) => {
    it(`should open modal by ${name} action`, async () => {
      await store.dispatch(actions[name]({
        component: null,
        props: null,
      }))
      expect(store.getActions()[0].type).toEqual(actions.MODALS_PUSH)
    })
  });

  ['modalsClose', 'modalsPop'].forEach((name) => {
    it(`should close modal by ${name} action`, async () => {
      await store.dispatch(actions[name]())
      expect(store.getActions()[0].type).toEqual(actions.MODALS_POP)
    })
  })

  it('should replace modal by modalsReplace action', async () => {
    await store.dispatch(actions.modalsReplace({
      component: null,
      props: null,
    }))
    expect(store.getActions()[0].type).toEqual(actions.MODALS_REPLACE)
  })

  it('should close all modals by modalsClear action', async () => {
    await store.dispatch(actions.modalsClear())
    expect(store.getActions()[0].type).toEqual(actions.MODALS_CLEAR)
  })
})

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { store, accounts } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import CBEModel from 'models/CBEModel'
import CBENoticeModel from 'models/notices/CBENoticeModel'
import ProfileModel from 'models/ProfileModel'
import * as notifier from 'redux/notifier/actions'
import * as validator from 'models/validator'
import * as a from './actions'

const user = new ProfileModel({ name: 'testUser' })
const cbe = new CBEModel({ address: accounts[ 2 ], name: user.name(), user })

describe('settings cbe actions', () => {
  afterEach(async (done) => {
    await setTimeout(() => {
      done()
    }, 3000)
  })
  it('should list CBE', async () => {
    await store.dispatch(a.listCBE())

    const list = store.getActions()[ 0 ].list
    expect(list instanceof Immutable.Map).toBeTruthy()

    const address = list.keySeq().toArray()[ 0 ]
    expect(validator.address(address)).toEqual(null)
    expect(list.get(address).address()).toEqual(accounts[ 0 ])
  })

  it('should add CBE', async (resolve) => {
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE((notice) => {
      expect(store.getActions()).toEqual([
        { type: a.CBE_SET, cbe: cbe.isFetching(true) },
      ])

      expect(notice.isRevoked()).toBeFalsy()
      expect(notice.cbe()).toMatchSnapshot()
      resolve()
    })
    await store.dispatch(a.addCBE(cbe))
  })

  it('should show load name to CBE form', () => store.dispatch(a.formCBELoadName(cbe.address(), 'TEST_FORM')).then(() => {
    expect(store.getActions()).toEqual([
      {
        isLoading: true,
        type: a.CBE_LOADING,
      },
      {
        isLoading: false,
        type: a.CBE_LOADING,
      },
      {
        meta: {
          field: 'name',
          form: 'TEST_FORM',
          persistentSubmitErrors: undefined,
          touch: undefined,
        },
        payload: cbe.name(),
        type: '@@redux-form/CHANGE',
      } ])
  }))

  it('should revoke CBE', async (resolve) => {
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.watchCBE((notice) => {
      expect(store.getActions()).toEqual([
        { type: a.CBE_SET, cbe: cbe.isFetching(true) },
      ])

      expect(notice.isRevoked()).toBeTruthy()
      expect(notice.cbe()).toMatchSnapshot()
      resolve()
    })
    await store.dispatch(a.revokeCBE(cbe))
  })

  it('should create a notice and dispatch CBE when updated', () => {
    const notice = new CBENoticeModel({ cbe, isRevoked: false })
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      { type: notifier.NOTIFIER_MESSAGE, notice, isStorable: true },
      { type: a.CBE_SET, cbe },
    ])
  })

  it('should create a notice and dispatch CBE when revoked', () => {
    const notice = new CBENoticeModel({ cbe, isRevoked: true })
    store.dispatch(a.watchCBE(notice, false))
    expect(store.getActions()).toEqual([
      { type: notifier.NOTIFIER_MESSAGE, notice, isStorable: true },
      { type: a.CBE_REMOVE, cbe },
    ])
  })

  it('should create an action to update cbe', () => {
    expect(a.setCBE(cbe)).toEqual({ type: a.CBE_SET, cbe })
  })

  it('should create an action to remove cbe', () => {
    expect(a.removeCBE(cbe)).toEqual({ type: a.CBE_REMOVE, cbe })
  })
})

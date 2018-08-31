/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import CBEModel from '../CBEModel'
import CBENoticeModel from './CBENoticeModel'
import ProfileModel from '../ProfileModel'

const model = new CBENoticeModel({
  cbe: new CBEModel({
    user: new ProfileModel({
      name: 'John',
      email: 'test@chronobank.io',
      company: 'ChronoBank',
    }),
  }),
})

describe('cbe notice', () => {
  it('should return message', () => {
    expect(model.message().value.length).toBeGreaterThan(3)
  })

  it('should return date', () => {
    expect(model.date()).toEqual(moment.unix(model.time() / 1000))
  })

  it('should return user data', () => {
    expect(model.cbe().user().name().length).toBeGreaterThan(3)
    expect(model.cbe().user().company().length).toBeGreaterThan(3)
    expect(model.cbe().user().email().length).toBeGreaterThan(3)
  })
})

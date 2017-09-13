import CBENoticeModel from './CBENoticeModel'
import CBEModel from '../CBEModel'
import ProfileModel from '../ProfileModel'
import React from 'react'
import Moment from 'components/common/Moment'
import moment from 'moment'

const model = new CBENoticeModel({
  cbe: new CBEModel({
    user: new ProfileModel({
      name: 'John',
      email: 'test@chronobank.io',
      company: 'ChronoBank'
    })
  })
})

describe('cbe notice', () => {
  it('should return message', () => {
    expect(model.message().length).toBeGreaterThan(3)
  })

  it('should return date', () => {
    expect(model.date()).toEqual(<Moment date={moment.unix(model.time() / 1000)} format={'HH:mm, MMMM Do, YYYY'}/>)
  })

  it('should return user data', () => {
    expect(model.cbe().user().name().length).toBeGreaterThan(3)
    expect(model.cbe().user().company().length).toBeGreaterThan(3)
    expect(model.cbe().user().email().length).toBeGreaterThan(3)
  })
})

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ProfileModel from './ProfileModel'

describe('user model', () => {
  it('should create model', () => {
    const model = new ProfileModel({
      name: 'John',
      email: 'john@chronobank.io',
      company: 'ChronoBank',
    })

    expect(model.name()).toEqual('John')
    expect(model.email()).toEqual('john@chronobank.io')
    expect(model.company()).toEqual('ChronoBank')
  })
})

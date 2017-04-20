import CBENoticeModel from '../../../src/models/notices/CBENoticeModel'
import CBEModel from '../../../src/models/CBEModel'
import UserModel from '../../../src/models/UserModel'

const model = new CBENoticeModel({
  cbe: new CBEModel({
    user: new UserModel({
      name: 'John',
      email: 'test@chronobank.io',
      company: 'ChronoBank'
    })
  })
})

describe('cbe notice', () => {
  it('should return id', () => {
    expect(model.id()).toEqual(model.time() + ' - ' + model.message())
  })

  it('should return message', () => {
    expect(model.message().length).toBeGreaterThan(3)
  })

  it('should return date', () => {
    expect(model.date().length).toBeGreaterThan(3)
  })

  it('should return user data', () => {
    expect(model.cbe().user().name().length).toBeGreaterThan(3)
    expect(model.cbe().user().company().length).toBeGreaterThan(3)
    expect(model.cbe().user().email().length).toBeGreaterThan(3)
  })
})

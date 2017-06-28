import CBENoticeModel from '../../../src/models/notices/CBENoticeModel'
import CBEModel from '../../../src/models/CBEModel'
import ProfileModel from '../../../src/models/ProfileModel'

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
    expect(model.date().length).toBeGreaterThan(3)
  })

  it('should return user data', () => {
    expect(model.cbe().user().name().length).toBeGreaterThan(3)
    expect(model.cbe().user().company().length).toBeGreaterThan(3)
    expect(model.cbe().user().email().length).toBeGreaterThan(3)
  })
})

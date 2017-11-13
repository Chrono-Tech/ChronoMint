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

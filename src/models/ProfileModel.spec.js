// import { Set } from 'immutable'
import ProfileModel, {validate} from './ProfileModel'

const model = new ProfileModel({
  name: 'John',
  email: 'john@chronobank.io',
  company: 'ChronoBank'
})

describe('user model', () => {
  it('should validate', () => {
    const values = new Map()
    values.set('name', model.name())
    values.set('email', model.email())
    values.set('company', model.company())
    expect(model.name()).toEqual('John')
    expect(validate(values)).toEqual({
      name: null,
      email: null,
      company: null
    })
  })
})

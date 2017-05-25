import ProfileModel, { validateRules } from '../../src/models/ProfileModel'
import { declarativeValidator } from '../../src/utils/validator'

const model = new ProfileModel({
  name: 'John',
  email: 'john@chronobank.io',
  company: 'ChronoBank'
})

describe('user model', () => {
  it('should validate', () => {
    const validator = declarativeValidator(validateRules)

    expect(validator(model)).toEqual({})
  })
})

import { abstractModel } from './AbstractModel'

class ProfileModel extends abstractModel({
  name: null,
  email: null,
  company: null
}) {
  name () {
    return this.get('name')
  }

  email () {
    return this.get('email')
  }

  company () {
    return this.get('company')
  }

  // noinspection JSUnusedGlobalSymbols
  isEmpty () {
    return this.get('name') === null
  }
}

// declarative
export const validateRules = {
  name: 'required|min:3',
  email: 'email',
  company: 'min:3'
}

export default ProfileModel

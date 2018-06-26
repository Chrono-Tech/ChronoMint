import { abstractModel } from './AbstractAccountModel'

export default class AccountEntryModel extends abstractModel({
  key: '',
  name: '',
  encrypted: [],
}) {
  get key () {
    return this.get('key')
  }

  get name () {
    return this.get('name')
  }

  get encrypted () {
    return this.get('encrypted')
  }
}


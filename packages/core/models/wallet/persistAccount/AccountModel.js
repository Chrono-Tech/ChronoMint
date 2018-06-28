import { abstractModel } from './AbstractAccountModel'

export default class AbstractModel extends abstractModel({
  wallet: null,
  entry: null,
}) {
  get wallet () {
    return this.get('wallet')
  }

  get entry () {
    return this.get('entry')
  }
}

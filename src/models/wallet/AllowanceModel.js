import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class AllowanceModel extends abstractFetchingModel({
  amount: new Amount(0, null, false),
  spender: null, //address
  token: null, // id
}) {
  id () {
    return this.get('spender')
  }
}

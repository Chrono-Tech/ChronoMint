import Amount from 'models/Amount'
import { abstractModel } from '../AbstractModel'

export default class BalanceModel extends abstractModel({
  // TODO @dkchv: may be set as b0,b3,b6?
  amount: new Amount(),
}) {
  id () {
    return this.amount().symbol()
  }

  amount () {
    return this.get('amount')
  }
}

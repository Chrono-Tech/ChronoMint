import Amount from 'models/Amount'
import BigNumber from 'bignumber.js'
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

  updateBalance (isCredited, amount: BigNumber) {
    const newBalance = this.amount()[isCredited ? 'plus' : 'minus'](amount)
    return this.set('amount', newBalance)
  }
}

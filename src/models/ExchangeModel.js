import { abstractModel } from './AbstractModel'
import { ExchangeDAO } from 'dao/ExchangeDAO'

export default class ExchangeModel extends abstractModel({
  dao: null
}) {

  dao (): ExchangeDAO {
    return this.get('dao')
  }

  address (): string {
    return this.dao().getInitAddress()
  }
}

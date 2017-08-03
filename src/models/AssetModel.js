import { abstractModel } from './AbstractModel'

export default class AssetModel extends abstractModel({
  address: null,
  symbol: null
}) {

  address (): string {
    return this.get('address')
  }

  symbol (): string {
    return this.get('symbol')
  }
}

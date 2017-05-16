import { abstractModel } from './AbstractModel'

class AssetModel extends abstractModel({
  symbol: null,
  buyPrice: null,
  sellPrice: null
}) {
  buyPrice () {
    return this.get('buyPrice')
  }

  sellPrice () {
    return this.get('sellPrice')
  }

  symbol () {
    return this.get('symbol')
  }
}

export default AssetModel

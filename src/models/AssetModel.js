import { abstractModel } from './AbstractModel'

class AssetModel extends abstractModel({
  title: null,
  buyPrice: null,
  sellPrice: null
}) {
  buyPrice () {
    return this.get('buyPrice')
  }

  sellPrice () {
    return this.get('sellPrice')
  }

  title () {
    return this.get('title')
  }
}

export default AssetModel

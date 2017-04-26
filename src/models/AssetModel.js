import {Record as record} from 'immutable'

class AssetModel extends record({
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
}

export default AssetModel

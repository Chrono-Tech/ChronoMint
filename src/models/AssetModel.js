import {Record as record} from 'immutable'

class AssetModel extends record({
  title: null,
  buyPrice: null,
  sellPrice: null
}) {
  buyPrice () {
    return this.get('buyPrice') * 100
  };

  sellPrice () {
    return this.get('sellPrice') * 100
  };
}

export default AssetModel

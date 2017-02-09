import {Record} from 'immutable';

class AssetModel extends Record({
    title: null,
    buyPrice: null,
    sellPrice: null
}) {}

export default AssetModel;
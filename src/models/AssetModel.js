import {Record as record} from 'immutable';

class AssetModel extends record({
    title: null,
    buyPrice: null,
    sellPrice: null
}) {
    printBuyPrice = () => {
        return this.buyPrice * 100;
    };

    printSellPrice = () => {
        return this.sellPrice * 100;
    };
}

export default AssetModel;
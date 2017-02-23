import DAO from './DAO';
import contract from 'truffle-contract';

export default class AssetDAO extends DAO {
    constructor(address) {
        super();
        const ChronoBankAsset = contract(require('../contracts/ChronoBankAsset.json'));
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAsset.at(address);
    }

    getProxyAddress = () => {
        return this.contract.then(deployed => {
            return deployed.proxy.call();
        });
    };
}
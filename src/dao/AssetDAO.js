import DAO from './DAO';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoBankAsset.json');
const ChronoBankAsset = contract(json);

export default class AssetDAO extends DAO {
    constructor(address) {
        super();
        ChronoBankAsset.setProvider(this.web3.currentProvider);
        this.contract = ChronoBankAsset.at(address);
    }

    getProxyAddress = () => {
        return this.contract.then(deployed => {
            return deployed.proxy.call();
        });
    };
}
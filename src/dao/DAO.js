import Web3 from 'web3';
import truffleConfig from '../../truffle-config.js';

class DAO {
    constructor() {
        if (new.target === DAO) {
            throw new TypeError('Cannot construct DAO instance directly');
        }

        const {networks: {development: {host, port}}} = truffleConfig;
        const hostname = (host === '0.0.0.0') ? window.location.hostname : host;
        this.web3Loc = `http://${hostname}:${port}`;

        this.web3 = typeof web3 !== 'undefined' ? // TODO this string produces warning because web3 is not defined
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(this.web3Loc));
    }

    getAddress = () => {
        return this.contract.then(deployed => deployed.address);
    };

    bytes32ToString = (bytes32) => {
        return this.web3.toAscii(bytes32).replace(/\u0000/g, '');
    };

    isEmptyAddress = (address: string) => {
        return address === '0x0000000000000000000000000000000000000000';
    };
}

export default DAO;
/* @flow */
import Web3 from 'web3';
import truffleConfig from '../../truffle-config.js';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoMint.json');
const ChronoMint = contract(json);

class DAO {
    constructor() {
        const {networks: {development: {host, port}}} = truffleConfig;
        const hostname = (host === '0.0.0.0') ? window.location.hostname : host;
        this.web3Loc = `http://${hostname}:${port}`;

        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(this.web3Loc));

        ChronoMint.setProvider(this.web3.currentProvider);
        this.contract = ChronoMint.deployed(); // replaced in child classes
        this.chronoMint = this.contract;
    }

    getMintAddress = () => {
        return this.chronoMint.then(deployed => deployed.address);
    };

    getAddress = () => {
        return this.contract.then(deployed => deployed.address);
    };

    bytes32ToString = (bytes32) => {
        return this.web3.toAscii(bytes32).replace(/\u0000/g, '');
    };
}

export default DAO;
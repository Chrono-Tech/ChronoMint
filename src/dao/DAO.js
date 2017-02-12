/* @flow */
import Web3 from 'web3';
import truffleConfig from '../../truffle.js';
import contract from 'truffle-contract';

const json = require('../contracts/ChronoMint.json');
const ChronoMint = contract(json);

class DAO {
    constructor() {
        const {networks: {development: {host, port}}} = truffleConfig;
        this.web3Loc = `http://${host}:${port}`;
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(this.web3Loc));

        ChronoMint.setProvider(this.web3.currentProvider);
        this.contract = ChronoMint.deployed();
        this.chronoMint = this.contract;
    }

    getMintAddress = () => {
        return this.chronoMint.then(deployed => deployed.address);
    };

    getAddress = () => {
        return this.contract.then(deployed => deployed.address);
    }
}

export default DAO;
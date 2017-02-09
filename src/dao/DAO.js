/* @flow */
import Web3 from 'web3';
import truffleConfig from '../../truffle.js'
import ChronoMint from '../contracts/ChronoMint.sol';

class DAO {
    constructor() {
        const hostname = (truffleConfig.rpc.host === '0.0.0.0') ? window.location.hostname : truffleConfig.rpc.host;
        this.web3Loc = `http://${hostname}:${truffleConfig.rpc.port}`;
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(this.web3Loc));

        ChronoMint.setProvider(this.web3.currentProvider);

        this.contract = ChronoMint.deployed();
        this.chronoMint = this.contract;
    }

    getMintAddress = () => {
        return this.chronoMint.address;
    };

    getAddress = () => {
        return this.contract.address;
    }
}

export default DAO;
/* @flow */
import Web3 from 'web3';
import contract from 'truffle-contract';
import ChronoMintJSON from 'contracts/ChronoMint.json';

let ChronoMint = contract(ChronoMintJSON);

class DAO {
    constructor() {
        this.web3Loc = `http://localhost:8545`;
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
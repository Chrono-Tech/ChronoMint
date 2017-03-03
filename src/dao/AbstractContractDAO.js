import Web3 from 'web3';
import truffleConfig from '../../truffle-config.js';
import truffleContract from 'truffle-contract';
import isEthAddress from '../utils/isEthAddress';

class AbstractContractDAO {
    constructor(json, at = null, optimizedAt = true) {
        if (new.target === AbstractContractDAO) {
            throw new TypeError('Cannot construct AbstractContractDAO instance directly');
        }

        const {networks: {development: {host, port}}} = truffleConfig;
        const hostname = (host === '0.0.0.0') ? window.location.hostname : host;
        this.web3Loc = `http://${hostname}:${port}`;

        /* global web3 */
        this.web3 = typeof web3 !== 'undefined' ?
            new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(this.web3Loc));

        const contract = truffleContract(json);
        contract.setProvider(this.web3.currentProvider);

        if (at === null) {
            this.contract = contract.deployed();
        } else if (optimizedAt) {
            this.contractDeployed = null;
            this.deployError = isEthAddress(at) ? null : 'invalid address passed';

            if (this.deployError === null) {
                contract.at(at)
                    .then(deployed => {
                        this.contractDeployed = deployed;
                    })
                    .catch(e => {
                        this.deployError = e;
                    });
            }
            // using 'at' is very expensive in time, so we wait until this.contractDeployed will be initialized
            // and then always return a loaded object
            this.contract = new Promise((resolve, reject) => {
                let interval = null;
                let callback = () => {
                    if (this.contractDeployed) {
                        clearInterval(interval);
                        resolve(this.contractDeployed);
                    }

                    if (this.deployError) {
                        reject(this.deployError);
                    }
                };
                callback();
                interval = setInterval(callback, 50);
            });
        } else {
            this.contract = contract.at(at);
        }
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

    watch = (event, callback) => {
        let fromBlock = localStorage.getItem('chronoBankWatchFromBlock');
        fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest';
        event({}, {fromBlock, toBlock: 'latest'}).watch((error, result) => {
            if (!error) {
                if (fromBlock === 'latest' || result.blockNumber > fromBlock) {
                    localStorage.setItem('chronoBankWatchFromBlock', result.blockNumber + 1);
                }
                callback(
                    result,
                    result.blockNumber,
                    this.web3.eth.getBlock(result.blockNumber).timestamp * 1000
                );
            }
        });
    };
}

export default AbstractContractDAO;
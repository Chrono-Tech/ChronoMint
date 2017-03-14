import Web3 from 'web3';
import truffleConfig from '../../truffle-config.js';
import truffleContract from 'truffle-contract';
import isEthAddress from '../utils/isEthAddress';
import bytes from '../../test/helpers/bytes32';

/**
 * Following variable is outside of the class because we want to stop watching
 * all events from child classes via only one stopWatching() call.
 * @see stopWatching
 * @type {Array}
 */
let events = [];

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

    getAddress() {
        return this.contract.then(deployed => deployed.address);
    };

    /**
     * @param bytes
     * @return {string}
     * @private
     */
    _bytesToString(bytes) {
        return this.web3.toAscii(bytes).replace(/\u0000/g, '');
    };

    /**
     * @param stringOrNumber
     * @return {string}
     * @private
     */
    _toBytes32(stringOrNumber) {
        return bytes(this.web3.toHex(stringOrNumber), false, true);
    };

    /**
     * @param stringOrNumber
     * @return {string}
     * @private
     */
    _toBytes14(stringOrNumber) {
        return bytes(this.web3.toHex(stringOrNumber), true, true);
    };

    /**
     * @param address
     * @return {boolean}
     * @private
     */
    _isEmptyAddress(address: string) {
        return address === '0x0000000000000000000000000000000000000000';
    };

    /**
     * @param event
     * @param callback if no error will receive result, block number and timestamp of event in milliseconds
     * @private
     */
    _watch(event, callback) {
        let fromBlock = localStorage.getItem('chronoBankWatchFromBlock');
        fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest';
        const instance = event({}, {fromBlock, toBlock: 'latest'});
        instance.watch((error, result) => {
            if (!error) {
                localStorage.setItem('chronoBankWatchFromBlock', result.blockNumber + 1);
                callback(
                    result,
                    result.blockNumber,
                    this.web3.eth.getBlock(result.blockNumber).timestamp * 1000
                );
            }
        });
        events.push(instance);
    };
}

export const stopWatching = () => {
    for (let key in events) {
        if (events.hasOwnProperty(key)) {
            events[key].stopWatching();
        }
    }
    events = [];
};

export default AbstractContractDAO;
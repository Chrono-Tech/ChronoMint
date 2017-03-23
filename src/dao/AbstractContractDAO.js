import Web3 from 'web3';
import truffleConfig from '../../truffle-config.js';
import truffleContract from 'truffle-contract';
import isEthAddress from '../utils/isEthAddress';

const {networks: {development: {host, port}}} = truffleConfig;
const hostname = (host === '0.0.0.0') ? window.location.hostname : host;
const web3 = typeof web3 !== 'undefined' ? new Web3(web3.currentProvider) : // eslint-disable-line no-use-before-define
    new Web3(new Web3.providers.HttpProvider(`http://${hostname}:${port}`));

/**
 * @type {number} to distinguish old and new blockchain events
 * @see AbstractContractDAO._watch
 */
const timestampStart = Date.now();

/**
 * Collection of all events to stop watching all of them via only one call of...
 * @see AbstractContractDAO.stopWatching
 * @type {Array}
 */
const events = [];

class AbstractContractDAO {
    constructor(json, at = null, optimizedAt = true) {
        if (new.target === AbstractContractDAO) {
            throw new TypeError('Cannot construct AbstractContractDAO instance directly');
        }

        this.web3 = web3;
        const contract = this._truffleContract(json);

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

    /**
     * @param json
     * @param deployed
     * @protected
     * @return {Object}
     */
    _truffleContract(json, deployed = false) {
        const contract = truffleContract(json);
        contract.setProvider(this.getWeb3().currentProvider);
        return deployed ? contract.deployed() : contract;
    }

    getWeb3() {
        if (!this.web3) {
            throw new Error('web3 is undefined');
        }
        return this.web3;
    }

    getAccounts() {
        return this.getWeb3().eth.accounts;
    }

    getAddress() {
        return this.contract.then(deployed => deployed.address);
    };

    /**
     * @param bytes
     * @return {string}
     * @protected
     */
    _bytesToString(bytes) {
        return this.getWeb3().toAscii(bytes).replace(/\u0000/g, '');
    };

    /**
     * @param value
     * @return {string}
     * @protected
     */
    _toBytes32(value) {
        return (this.getWeb3().toHex(value) + '0'.repeat(63)).substr(0, 66);
    };

    /**
     * @param value
     * @return {string}
     * @protected
     */
    _toBytes14(value) {
        return (this.getWeb3().toHex(value) + '0'.repeat(27)).substr(0, 30);
    };

    /**
     * @param address
     * @return {boolean}
     * @protected
     */
    _isEmptyAddress(address: string) {
        return address === '0x0000000000000000000000000000000000000000';
    };

    /**
     * This function will read events from the last block saved in localStorage or from the latest block in network
     * if localStorage for provided event is empty.
     * @param event
     * @param callback in the absence of error will receive event result object, block number, timestamp of event
     * in milliseconds and special isOld flag, which will be true if received event is older than timestampStart
     * @see timestampStart
     * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
     * want to keep receiving of saved block number from user localStorage.
     * @protected
     */
    _watch(event, callback, id = Math.random()) {
        const key = 'fromBlock-' + id;
        let fromBlock = localStorage.getItem(key);
        fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest';
        const instance = event({}, {fromBlock, toBlock: 'latest'});
        instance.watch((error, result) => {
            if (!error) {
                const ts = this.getWeb3().eth.getBlock(result.blockNumber).timestamp;
                localStorage.setItem(key, result.blockNumber + 1);
                callback(
                    result,
                    result.blockNumber,
                    ts * 1000,
                    Math.floor(timestampStart / 1000) > ts
                );
            }
        });
        events.push(instance);
    };

    static stopWatching() {
        for (let key in events) {
            if (events.hasOwnProperty(key)) {
                events[key].stopWatching();
            }
        }
        events.splice(0, events.length);
    }
}

export default AbstractContractDAO;
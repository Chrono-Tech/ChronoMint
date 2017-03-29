/*eslint new-cap: ["error", { "capIsNewExceptions": ["Transfer"] }]*/
import AbstractProxyDAO from './AbstractProxyDAO';
import ChronoMintDAO from './ChronoMintDAO';

class LHTProxyDAO extends AbstractProxyDAO {
    proposeUpgrade = () => {
        return ChronoMintDAO.getAddress().then(address => {
            this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}));
        });
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deployed => deployed.transfer(recipient, amount * 100, {from: sender, gas: 3000000}));
    };

    watchTransfer = (callback) => {
        this.contract.then(deployed => {
            deployed.Transfer().watch(callback)
        });
    };

    getTransfer = (callback, filter = null) => {
        this.contract.then(deployed => {
            deployed.Transfer({}, filter).get(callback)
        });
    };
}

export default new LHTProxyDAO(require('../contracts/ChronoBankAssetWithFeeProxy.json'));
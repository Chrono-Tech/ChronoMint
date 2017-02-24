import AbstractProxyDAO from './AbstractProxyDAO';
import AppDAO from './AppDAO';

class TimeProxyDAO extends AbstractProxyDAO {
    proposeUpgrade = () => {
        return AppDAO.getAddress().then(address => {
            this.contract.then(deployed => deployed.proposeUpgrade(this.time.address, {from: address}));
        });
    };

    transfer = (amount, recipient, sender) => {
        return this.contract.then(deploy => deploy.transfer(recipient, amount * 100, {from: sender, gas: 3000000}));
    };
}

export default new TimeProxyDAO(require('../contracts/ChronoBankAssetProxy.json'));
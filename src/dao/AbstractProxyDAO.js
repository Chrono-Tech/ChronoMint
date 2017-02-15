import DAO from './DAO';

class AbstractProxyDAO extends DAO {
    constructor() {
        super();
        if (new.target === AbstractProxyDAO) {
            throw new TypeError('Cannot construct AbstractProxyDAO instance directly');
        }
    }

    getName = () => {
        return this.contract.then(deployed => deployed.name.call());
    };

    getSymbol = () => {
        return this.contract.then(deployed => deployed.symbol.call());
    };

    totalSupply = () => {
        return this.contract.then(deployed => deployed.totalSupply().then(supply => {
            return supply.toNumber();
        }));
    };

    getAccountBalance = (account) => {
        return this.contract.then(deployed => deployed.balanceOf(account));
    };
}

export default AbstractProxyDAO;
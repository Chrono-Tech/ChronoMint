import DAO from './DAO';

class CBEAddressDAO extends DAO {
    /** @return bool */
    add = (address) => {
        return this.contract.then(i => {
            //noinspection JSUnusedLocalSymbols
            return i.addKey(address, {from: this.web3.eth.accounts[0], gas: 3000000}).then(r => {
                return i.isAuthorized.call(address);
            })
        });
    };

    /** @return TODO */
    revoke = (address) => {
        // TODO
    };
}

export default new CBEAddressDAO();
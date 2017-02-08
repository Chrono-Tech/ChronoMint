import DAO from './DAO';

class CBEAddressDAO extends DAO {
    add = (address) => {
        // TODO Is authorized?
        return this.contract.then(instance => instance.addKey(address));
    }
}

export default new CBEAddressDAO();
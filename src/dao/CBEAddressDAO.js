import DAO from './DAO';

class CBEAddressDAO extends DAO {
    add = (address) => {
        // TODO Is authorized?
        return this.contract.addKey(address);
    }
}

export default new CBEAddressDAO();
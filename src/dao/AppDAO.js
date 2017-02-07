import DAO from './dao';

class AppDAO extends DAO {
    constructor() {
        super();
    }

    isCBE = (address) => {
        return this.chronoMint.isCBE.call(address, {from: address});
    };

    getLOCCount = (account) => {
        return this.chronoMint.getLOCCount.call({from: account});
    };

    getLOCbyID = (index, address) => {
        return this.chronoMint.getLOCbyID.call(index, {from: address || this.getMintAddress()});
    };
}

export default new AppDAO();
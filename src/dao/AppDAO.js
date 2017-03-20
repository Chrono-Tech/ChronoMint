import AbstractContractDAO from './AbstractContractDAO';

class AppDAO extends AbstractContractDAO {
    constructor() {
        super(require('../contracts/ChronoMint.json'));
    }

    reissueAsset = (asset: string, amount: number, account: string, locAddress: string ) => {
        return this.contract.then(deployed => {
            return deployed.reissueAsset.call(asset, amount, locAddress, {from: account} )
                .then(r => {
                    if (!r) return false;
                    deployed.reissueAsset(asset, amount, locAddress, {from: account, gas: 3000000} );
                    return r;
                })
        })
    };
}

export default new AppDAO();
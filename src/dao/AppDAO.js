import DAO from './dao';

class AppDAO extends DAO {
    constructor() {
        super();

        this.timeEnumIndex = 8;
        this.lhtEnumIndex = 16;
    }

    isCBE = (account: string) => {
        return this.chronoMint.then(deployed => deployed.isAuthorized.call(account, {from: account}));
    };

    getLOCCount = (account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCCount.call({from: account}));
    };

    getLOCbyID = (index: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.getLOCbyID.call({index, from: account}));
    };

    reissueAsset = (asset: string, amount: number, account: string) => {
        return this.chronoMint.then(deployed => deployed.reissueAsset(asset, amount, {from: account}));
    };

    getBalance = (enumIndex: number) => {
        return this.chronoMint.then(deployed => deployed.getBalance.call(enumIndex));
    };

    getLhtBalance = () => {
        return this.getBalance(this.lhtEnumIndex);
    };

    getTimeBalance = () => {
        return this.getBalance(this.timeEnumIndex);
    };

    send = (enumIndex: number, to: string, amount: number, account:string) => {
        return this.chronoMint.then(deployed => {
            console.log(to, account, deployed);
            deployed.sendAsset(enumIndex, to, amount, {from: account, gas: 3000000});
        });
    };

    sendLht = (to, amount, account) => {
        console.log(to, amount, account);
        return this.send(this.lhtEnumIndex, to, amount, account);
    };

    sendTime = (to, amount, account) => {
        return this.send(this.timeEnumIndex, to, amount, account);
    };

    setExchangePrices = () => {

    };


}

export default new AppDAO();
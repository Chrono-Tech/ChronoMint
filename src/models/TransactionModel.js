import {Record as record} from 'immutable';
import moment from 'moment';
import AppDAO from '../dao/AppDAO';

class TransactionModel extends record({
    txHash: null,
    nonce: null,
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    from: null,
    to: null,
    value: null,
    time: null,
    gasPrice: null,
    gas: null,
    input: null,
    credited: null,
    symbol: ''
}) {
    getTransactionTime() {
        return moment.unix(this.time).format('Do MMMM YYYY HH:mm:ss');
    }
    getValue() {
        if (this.symbol === 'ETH') {
            return AppDAO.web3.fromWei(this.value, 'ether').toNumber();
        } else {
            return this.value.toNumber() / 100;
        }
    }
    getTransactionSign() {
        return this.credited ? '+' : '-';
    }
}

export default TransactionModel;
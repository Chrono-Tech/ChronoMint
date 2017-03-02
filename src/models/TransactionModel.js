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
    credited: null
}) {
    getTransactionTime() {
        return moment.unix(this.time).format('Do MMMM YYYY');
    }
    getValue() {
        return AppDAO.web3.fromWei(this.value, 'ether').toNumber();
    }
    getTransactionSign() {
        return this.credited ? '+' : '-';
    }
}

export default TransactionModel;
import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';
import TransactionScannerDAO from '../../../dao/TransactionScannerDAO';

import {
    setTimeBalanceStart,
    setTimeBalanceSuccess,
    setLHTBalanceStart,
    setLHTBalanceSuccess,
    setETHBalanceStart,
    setETHBalanceSuccess,
    setEthTransactionStart,
    setEthTransactionSuccess
} from './reducer';

const updateTimeBalance = () => (dispatch) => {
    dispatch(setTimeBalanceStart());
    TimeProxyDAO.getAccountBalance(localStorage.getItem('chronoBankAccount'))
        .then(balance => dispatch(setTimeBalanceSuccess(balance.toNumber())));
};

const updateLHTBalance = () => (dispatch) => {
    dispatch(setLHTBalanceStart());
    LHTProxyDAO.getAccountBalance(localStorage.getItem('chronoBankAccount'))
        .then(balance => {
            dispatch(setLHTBalanceSuccess(balance.toNumber()))
        });
};

const updateETHBalance = () => (dispatch) => {
    dispatch(setETHBalanceStart());
    const balance = TimeProxyDAO.web3.fromWei(TimeProxyDAO.web3.eth.getBalance(localStorage.getItem('chronoBankAccount')));
    dispatch(setETHBalanceSuccess(balance.toNumber()));
};

const transferEth = (amount, recipient) => (dispatch) => {
    const txHash = LHTProxyDAO.web3.eth.sendTransaction({
        from: localStorage.getItem('chronoBankAccount'),
        to: recipient,
        value: LHTProxyDAO.web3.toWei(parseFloat(amount, 10), "ether")
    });

    const pendingBlock = LHTProxyDAO.web3.eth.getBlock("pending");
    pendingBlock.transactions.forEach(tx => {
        if (tx === txHash) {
            const txn = LHTProxyDAO.web3.eth.getTransaction(txHash);
            dispatch(setEthTransactionSuccess({
                txHash: txn.hash,
                nonce: txn.nonce,
                blockHash: txn.blockHash,
                blockNumber: txn.blockNumber,
                transactionIndex: txn.transactionIndex,
                from: txn.from,
                to: txn.to,
                value: txn.value,
                time: pendingBlock.timestamp,
                gasPrice: txn.gasPrice,
                gas: txn.gas,
                input: txn.input,
                credited: false
            }));
        }
    });

    dispatch(updateETHBalance());

};

const transferLht = (amount, recipient) => (dispatch) => {
    dispatch(setLHTBalanceStart());
    LHTProxyDAO.transfer(amount, recipient, localStorage.getItem('chronoBankAccount'))
        .then(() => dispatch(updateLHTBalance()));
};

const transferTime = (amount, recipient) => (dispatch) => {
    dispatch(setTimeBalanceStart());
    TimeProxyDAO.transfer(amount, recipient, localStorage.getItem('chronoBankAccount'))
        .then(() => dispatch(updateTimeBalance()));
};

const getTransactionsByAccount = (account, transactionsCount) => (dispatch) => {

    dispatch(setEthTransactionStart());

    function scanTransactionCallback(txn, block) {
        if (txn.to === account) {
            // A transaction credited ether into this wallet
            const ether = TransactionScannerDAO.web3.fromWei(txn.value, 'ether');
            console.log(`\r${block.timestamp} +${ether} from ${txn.from}`);
        } else if (txn.from === account) {
            // A transaction debitted ether from this wallet
            const ether = TransactionScannerDAO.web3.fromWei(txn.value, 'ether');
            console.log(`\r${block.timestamp} -${ether} to ${txn.to}`);
        }

        if ((txn.to === account || txn.from === account) && txn.value > 0) {
            dispatch(setEthTransactionSuccess({
                txHash: txn.hash,
                nonce: txn.nonce,
                blockHash: txn.blockHash,
                blockNumber: txn.blockNumber,
                transactionIndex: txn.transactionIndex,
                from: txn.from,
                to: txn.to,
                value: txn.value,
                time: block.timestamp,
                gasPrice: txn.gasPrice,
                gas: txn.gas,
                input: txn.input,
                credited: txn.to === account
            }));
        }
    }

    TransactionScannerDAO.scanBlockRange(transactionsCount, null, null, scanTransactionCallback);
};

export {
    updateTimeBalance,
    updateLHTBalance,
    updateETHBalance,
    transferEth,
    transferLht,
    transferTime,
    getTransactionsByAccount
}


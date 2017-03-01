import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';
import AppDAO from '../../../dao/AppDAO';

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
    LHTProxyDAO.web3.eth.sendTransaction({
        from: localStorage.getItem('chronoBankAccount'),
        to: recipient,
        value: LHTProxyDAO.web3.toWei(parseFloat(amount, 10), "ether")
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

const getTransactionsByAccount = (account, startBlockNumber, endBlockNumber, transactionsCount) => (dispatch) => {
        dispatch(setEthTransactionStart());
        AppDAO.getTransactions(account, startBlockNumber, endBlockNumber, transactionsCount).then(blocks => {
             blocks.forEach(block => {
                 block.transactions.forEach(function (e) {
                     if (account === "*" || account === e.from || account === e.to) {
                         dispatch(setEthTransactionSuccess({
                             txHash: e.hash,
                             nonce: e.nonce,
                             blockHash: e.blockHash,
                             blockNumber: e.blockNumber,
                             transactionIndex: e.transactionIndex,
                             from: e.from,
                             to: e.to,
                             value: e.value,
                             time: block.timestamp,
                             gasPrice: e.gasPrice,
                             gas: e.gas,
                             input: e.input
                         }));
                     }
                 });
             });
        });
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


import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';
import ProxyDAO from '../../../dao/ProxyDAO';
import TransactionScannerDAO from '../../../dao/TransactionScannerDAO';

import {
    setTimeBalanceStart,
    setTimeBalanceSuccess,
    setLHTBalanceStart,
    setLHTBalanceSuccess,
    setETHBalanceStart,
    setETHBalanceSuccess,
    setTransactionStart,
    setTransactionSuccess
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
            dispatch(setTransactionSuccess({
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
                credited: false,
                symbol: 'ETH'
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

const getTransactionsByAccount = (account, transactionsCount, endBlock) => (dispatch) => {
    dispatch(setTransactionStart());
    function scanTransactionCallback(txn, block) {
        if ((txn.to === account || txn.from === account) && txn.value > 0) {
            dispatch(setTransactionSuccess({
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
                credited: txn.to === account,
                symbol: 'ETH'
            }));
        }
    }

    function scanTransferCallback(e, r) {
        if (r.length > 0) {
            const AssetProxy = new ProxyDAO(r[0].address);
            AssetProxy.getSymbol().then(symbol => {
                r.forEach(txn => {
                    if ((txn.args.to === account || txn.args.from === account) && txn.args.value > 0) {
                        const block = TransactionScannerDAO.web3.eth.getBlock(txn.blockHash);

                        dispatch(setTransactionSuccess({
                            txHash: txn.transactionHash,
                            blockHash: txn.blockHash,
                            blockNumber: txn.blockNumber,
                            transactionIndex: txn.transactionIndex,
                            from: txn.args.from,
                            to: txn.args.to,
                            value: txn.args.value,
                            time: block.timestamp,
                            credited: txn.args.to === account,
                            symbol
                        }));
                    }
                });
            });
        }
    }

    function watchTransferCallback(e, txn) {
        console.log(txn);
        const AssetProxy = new ProxyDAO(txn.address);
        AssetProxy.getSymbol().then(symbol => {
            if ((txn.args.to === account || txn.args.from === account) && txn.args.value > 0) {
                const block = TransactionScannerDAO.web3.eth.getBlock(txn.blockHash);

                dispatch(setTransactionSuccess({
                    txHash: txn.transactionHash,
                    blockHash: txn.blockHash,
                    blockNumber: txn.blockNumber,
                    transactionIndex: txn.transactionIndex,
                    from: txn.args.from,
                    to: txn.args.to,
                    value: txn.args.value,
                    time: block.timestamp,
                    credited: txn.args.to === account,
                    symbol
                }));
            }
        });
    }

    TransactionScannerDAO.scanBlockRange(transactionsCount, null, endBlock, scanTransactionCallback);
    const toBlock = endBlock ? endBlock : TransactionScannerDAO.web3.eth.blockNumber;

    TimeProxyDAO.getTransfer(scanTransferCallback,
        {
            fromBlock: toBlock - transactionsCount < 0 ? 0 : toBlock - transactionsCount,
            toBlock
        });

    LHTProxyDAO.getTransfer(scanTransferCallback,
        {
            fromBlock: toBlock - transactionsCount < 0 ? 0 : toBlock - transactionsCount,
            toBlock
        });

    LHTProxyDAO.watchTransfer(watchTransferCallback);
    TimeProxyDAO.watchTransfer(watchTransferCallback);
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


import {Map, List} from 'immutable';

// Constants
const WALLET_CONFIGURE = 'wallet/CONFIGURE';
const WALLET_SET_ACCOUNTS = 'wallet/SET_ACCOUNTS';
const WALLET_SET_CURRENT_ACCOUNT = 'wallet/SET_CURRENT_ACCOUNT';
const WALLET_SET_ETHER_BALANCE = 'wallet/SET_ETHER_BALANCE';
const WALLET_SET_BALANCES = 'wallet/SET_BALANCES';
const WALLET_SET_EXCHANGE_RATES = 'wallet/SET_EXCHANGE_RATES';
const WALLET_SET_LISTENERS = 'wallet/SET_LISTENERS';
const WALLET_SEND = 'wallet/SEND';

// Reducer
const initialState = Map({});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case WALLET_CONFIGURE: {
            return state.merge(action.payload);
        }
        case WALLET_SET_ACCOUNTS: {
            return state.merge(action.payload);
        }
        case WALLET_SET_CURRENT_ACCOUNT: {
            return state.merge(action.payload);
        }
        case WALLET_SET_ETHER_BALANCE: {
            return state.merge(action.payload);
        }
        case WALLET_SET_BALANCES: {
            return state.merge({balances: action.payload});
        }
        case WALLET_SET_EXCHANGE_RATES: {
            return state.merge({exchangeRates: action.payload});
        }
        case WALLET_SET_LISTENERS: {
            return state.merge({listeners: action.payload});
        }
        case WALLET_SEND: {
            let hashes;
            if (state.get('txHashes')) {
                hashes = state.get('txHashes');
            } else {
                hashes = List();
            }
            return state.merge({txHashes: hashes.push(action.payload)});
        }
        default:
            return state
    }
};

// Actions
import Promise from 'bluebird';
import config from '../../configABI';
import {store} from'../configureStore';
import {Map} from 'immutable';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export function configure() {
    let contracts = config.contractAddresses.map(address => {
        return Promise.promisifyAll((web3.eth.contract(config.contractABI)).at(address));
    });
    let exchangeContracts = config.exchangeContract.map(address => {
        return Promise.promisifyAll((web3.eth.contract(config.exchangeABI)).at(address));
    });
    return {
        type: 'CONFIGURE',
        payload: {
            contracts: contracts,
            exchangeContracts: exchangeContracts
        }
    }
}

export function getAccounts() {
    Promise.all(web3.eth.accounts).then((accounts) => {
        store.dispatch({
            type: 'SET_ACCOUNTS',
            payload: {
                accounts: accounts
            }
        });
        if (accounts.length !== 0) {
            setCurrentAccount(accounts[0]);
        }
    });
}

export function setCurrentAccount(address) {
    web3.eth.defaultAccount = address;
    store.dispatch({
        type: 'SET_CURRENT_ACCOUNT',
        payload: {
            currentAccount: address
        }
    });
    getEthBalance();
    getBalances();
    setUpTransferListeners(address);
}

export function getEthBalance() {
    web3.eth.getBalance(web3.eth.defaultAccount, (err, res) => {
        store.dispatch({
            type: 'SET_ETHER_BALANCE',
            payload: {
                ethBalance: web3.fromWei(res.toString())
            }
        });
    });
}

function setUpTransferListeners(address) {
    let contracts = store.getState().get('contracts');
    let listeners = store.getState().get('listeners');
    if (listeners) {
        listeners.forEach(listener => listener.stopWatching());
    }
    return Promise.map(contracts, contract => contract.Transfer({to: address}, (err, result) => {
        if (err) {
            console.log('ParseTransferError', err);
        } else {
            getBalances();
        }
    })).then(listeners =>
        store.dispatch({
            type: 'SET_LISTENERS',
            payload: listeners
        })
    );
}

export function getBalances() {
    let contracts = store.getState().get('contracts');
    let account = store.getState().get('currentAccount');
    let days = moment().diff(moment([2016, 11, 1]), 'days');
    return Promise.map(contracts, (contract, index) => {
        return Promise.all([contract.symbolAsync(), contract.balanceOfAsync(account),
            contract.balanceOfAsync(account, 'pending'),
            contract.allowanceAsync(account, config.exchangeContract[index])])
            .then(([symbol, balance, pending, allowance]) => Map({
                symbol: web3.toAscii(symbol),
                balance: balance.div(Math.pow(10, 8)).toNumber(),
                pending: pending.minus(balance).div(Math.pow(10, 8)).toNumber(),
                fiatSymbol: config.fiat[index],
                fiatRate: new BigNumber(config.fiatStartRate[index]).plus(new BigNumber(config.fiatRatio[index]).times(new BigNumber(days))),
                fee: new BigNumber(config.fee[index]),
                contract: contract,
                allowance: allowance.toString()
            }))
    }).then(entries => {
        let balances = [];
        entries.forEach(entry => balances.push(entry));
        store.dispatch({
            type: 'SET_BALANCES',
            payload: balances
        });
    });
}

export function send(to, amount, symbol) {
    let value = new BigNumber(amount).times(Math.pow(10, 8)).toString();
    let balances = store.getState().get('balances');
    let contract = balances.filter(balance => balance.get('symbol') === symbol).get(0).get('contract');
    contract.transferAsync(to, value, {gas:config.send_gas}).then(hash => {
        store.dispatch({
            type: 'SEND',
            payload: hash
        });
        getBalances();
    });
}

export function getExchangeRates() {
    let exchangeContracts = store.getState().get('exchangeContracts');
    let contracts = store.getState().get('contracts');
    return Promise.map(exchangeContracts, (contract, index) => {
        return Promise.all([contract.sellPriceAsync(), contract.buyPriceAsync(), contracts.get(index).symbolAsync()])
            .then(([sellPrice, buyPrice, symbol]) => Map({
                symbol: web3.toAscii(symbol),
                sellPrice: new BigNumber(web3.fromWei(sellPrice.toString())).times(Math.pow(10, 8)),
                buyPrice: new BigNumber(web3.fromWei(buyPrice.toString())).times(Math.pow(10, 8))
            }))
    }).then(entries => {
        let exchangeRates = [];
        entries.forEach(entry => exchangeRates.push(entry));
        store.dispatch({
            type: 'SET_EXCHANGE_RATES',
            payload: exchangeRates
        });
    });
}

export function approve(currency, approveWanted) {
    let balances = store.getState().get('balances');
    let exchangeIndex = 0;
    let asset = balances.filter((balance, index) => {
        let isCurrency = balance.get('symbol') === currency;
        if (isCurrency) {
            exchangeIndex = index;
        }
        return isCurrency;
    }).get(0);
    if (approveWanted) {
        if (asset.get('allowance') === '0') {
            return asset.get('contract').approveAsync(config.exchangeContract[exchangeIndex],
                new BigNumber('0xf000000000000000000000000000000000000000000000000000000000000000'), {gas:config.approve_gas})
                .then(result => result ? getBalances() : null);
        }
    } else if (asset.get('allowance') !== '0') {
        return asset.get('contract').approveAsync(config.exchangeContract[exchangeIndex], new BigNumber(0), {gas:config.approve_gas})
            .then(result => result ? getBalances() : null);
    }
}

//Sell my tokens for ether
export function sell(amount, currency) { //amount of tokens and token symbol
    amount = new BigNumber(amount).times(Math.pow(10, 8)).toString();
    getExchangeRates();
    let balances = store.getState().get('balances');
    let index = balances.findIndex(balance => balance.get('symbol') === currency);
    let exchangeContracts = store.getState().get('exchangeContracts');
    let buyPrice = web3.toWei(new BigNumber(store.getState().get('exchangeRates').get(index).get('buyPrice')).div(Math.pow(10,8)).toString(), 'ether');
    return exchangeContracts.get(index).sellAsync(amount, buyPrice, {gas:config.exchange_gas})
        .then(result => result ? console.log(result) : null);
}

//Buy tokens for my ether
export function buy(amount, currency) { //amount of tokens and token symbol
    amount = new BigNumber(amount).times(Math.pow(10, 8));
    getExchangeRates();
    let balances = store.getState().get('balances');
    let index = balances.findIndex(balance => balance.get('symbol') === currency);
    let exchangeContracts = store.getState().get('exchangeContracts');
    let sellPrice = web3.toWei(new BigNumber(store.getState().get('exchangeRates').get(index).get('sellPrice')).div(Math.pow(10,8)).toString(), 'ether');
    return exchangeContracts.get(index).buyAsync(amount.toString(), sellPrice, {value: new BigNumber(sellPrice).times(amount), gas:config.exchange_gas})
        .then(result => result ? console.log(result) : null);
}

export default reducer;
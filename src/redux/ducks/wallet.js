import {Map, List} from 'immutable';

// Constants
const WALLET_SET_BALANCES = 'wallet/SET_BALANCES';
const WALLET_SET_EXCHANGE_RATES = 'wallet/SET_EXCHANGE_RATES';
const WALLET_SEND = 'wallet/SEND';

// Reducer
const initialState = new Map;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case WALLET_SET_EXCHANGE_RATES: {
            return state.merge({exchangeRates: action.payload});
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

const setBalances = (payload) => ({type: WALLET_SET_BALANCES, payload});
const setExchangeRates = (payload) => ({type: WALLET_SET_EXCHANGE_RATES, payload});

const getBalances = () => (dispatch) => {
    const account = store.getState().get('session').account;

    //...
    let balances = {};
    dispatch(setBalances(balances));
};

const getExchageRates = () => (dispatch) => {
    let rates = {};
    dispatch(setExchangeRates(rates));
};

export {
    getBalances,
    getExchageRates
}

export default reducer;
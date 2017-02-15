import {Map} from 'immutable';
import {showSettingsTokenViewModal} from '../../../redux/ducks/ui/modal';
import {showSettingsTokenModal} from '../../../redux/ducks/ui/modal';
import TokenModel from '../../../models/TokenModel';
import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';
import ProxyDao from '../../../dao/ProxyDAO';

const TOKENS_LIST = 'settings/TOKENS_LIST';
const TOKENS_VIEW = 'settings/TOKENS_VIEW';
const TOKENS_BALANCES_PAGE_COUNT = 'settings/TOKENS_BALANCES_PAGE_COUNT';
const TOKENS_BALANCES = 'settings/TOKENS_BALANCES';
const TOKENS_FORM = 'settings/TOKENS_FORM';
const TOKENS_WATCH_UPDATE = 'settings/TOKENS_WATCH_UPDATE';

const initialState = {
    list: new Map,
    selected: new TokenModel, // for modify & view purposes
    balances: new Map,
    balancesPageCount: 0
};

let currentProxy = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKENS_LIST:
            return {
                ...state,
                list: action.list
            };
        case TOKENS_VIEW:
        case TOKENS_FORM:
            return {
                ...state,
                selected: action.token
            };
        case TOKENS_BALANCES_PAGE_COUNT:
            return {
                ...state,
                balancesPageCount: action.count
            };
        case TOKENS_BALANCES:
            return {
                ...state,
                balances: action.balances
            };
        case TOKENS_WATCH_UPDATE:
            return {
                ...state,
                list: state.list.set(action.token.address(), action.token)
            };
        default:
            return state;
    }
};

const listTokens = () => (dispatch) => {
    // TODO Code below is temporary and will be refactored when ChronoMint contract will allow to get tokens list
    TimeProxyDAO.getAddress().then(timeAddress => {
        TimeProxyDAO.getName().then(timeName => {
            TimeProxyDAO.getSymbol().then(timeSymbol => {
                LHTProxyDAO.getAddress().then(lhtAddress => {
                    LHTProxyDAO.getName().then(lhtName => {
                        LHTProxyDAO.getSymbol().then(lhtSymbol => {
                            let tokens = new Map;
                            tokens = tokens.set(timeSymbol, new TokenModel({
                                name: timeName,
                                address: timeAddress,
                                symbol: timeSymbol
                            }));
                            tokens = tokens.set(lhtSymbol, new TokenModel({
                                name: lhtName,
                                address: lhtAddress,
                                symbol: lhtSymbol
                            }));

                            dispatch({type: TOKENS_LIST, list: tokens});
                        });
                    });
                });
            });
        });
    });
};

const viewToken = (token: TokenModel) => (dispatch) => {
    currentProxy = new ProxyDao(token.address());
    currentProxy.totalSupply().then(supply => {
        token = token.set('totalSupply', supply);
        dispatch({type: TOKENS_VIEW, token});
        dispatch(listBalances());
        dispatch(showSettingsTokenViewModal());
    });
};

const listBalances = (page = 0, address = null) => (dispatch) => {
    let balances = new Map;

    if (address === null) { // TODO This block is temporary and will be refactored when ChronoMint contract will allow to get balances list
        let perPage = 100;
        let balancesNum = 1057;
        dispatch({type: TOKENS_BALANCES_PAGE_COUNT, count: Math.ceil(balancesNum / perPage)});
        // then
        for (let i = 0; i < 100; i++) {
            balances = balances.set(page + 'x' + i, Math.random() * (1000 - 100) + 100);
        }
        dispatch({type: TOKENS_BALANCES, balances});
    } else {
        dispatch({type: TOKENS_BALANCES_PAGE_COUNT, count: 0});
        if (/^0x[0-9a-f]{40}$/i.test(address)) {
            currentProxy.getAccountBalance(address).then(balance => {
                balances = balances.set(address, balance.toNumber());
                dispatch({type: TOKENS_BALANCES, balances});
            });
        } else {
            dispatch({type: TOKENS_BALANCES, balances});
        }
    }
};

const formToken = (token: TokenModel) => (dispatch) => {
    dispatch({type: TOKENS_FORM, token});
    dispatch(showSettingsTokenModal());
};

const treatToken = (current: TokenModel, updated: TokenModel) => (dispatch) => {
    // TODO
    // TODO Error dispatcher?
};

const watchUpdateToken = (token: TokenModel) => ({type: TOKENS_WATCH_UPDATE, token});

export {
    listTokens,
    viewToken,
    listBalances,
    formToken,
    treatToken,
    watchUpdateToken
}

export default reducer;
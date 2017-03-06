import {Map} from 'immutable';
import {showSettingsTokenViewModal} from '../../../redux/ducks/ui/modal';
import {showSettingsTokenModal} from '../../../redux/ducks/ui/modal';
import TokenContractModel from '../../../models/TokenContractModel';
import AppDAO from '../../../dao/AppDAO';
import PlatformDAO from '../../../dao/PlatformDAO';
import {notify} from '../../../redux/ducks/notifier/notifier';
import TokenContractNoticeModel from '../../../models/notices/TokenContractNoticeModel';
import isEthAddress from '../../../utils/isEthAddress';

export const TOKENS_LIST = 'settings/TOKENS_LIST';
export const TOKENS_VIEW = 'settings/TOKENS_VIEW';
export const TOKENS_BALANCES_NUM = 'settings/TOKENS_BALANCES_NUM';
export const TOKENS_BALANCES = 'settings/TOKENS_BALANCES';
export const TOKENS_FORM = 'settings/TOKENS_FORM';
export const TOKENS_UPDATE = 'settings/TOKENS_UPDATE';
export const TOKENS_REMOVE = 'settings/TOKENS_REMOVE';
export const TOKENS_ERROR = 'settings/TOKENS_ERROR';
export const TOKENS_HIDE_ERROR = 'settings/TOKENS_HIDE_ERROR';

const initialState = {
    list: new Map(),
    selected: new TokenContractModel(), // for modify & view purposes
    balances: new Map(),
    balancesNum: 0,
    balancesPageCount: 0,
    error: false // or error contract address
};

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
        case TOKENS_BALANCES_NUM:
            return {
                ...state,
                balancesNum: action.num,
                balancesPageCount: action.pages
            };
        case TOKENS_BALANCES:
            return {
                ...state,
                balances: action.balances
            };
        case TOKENS_UPDATE:
            return {
                ...state,
                list: state.list.set(action.token.address(), action.token)
            };
        case TOKENS_REMOVE:
            return {
                ...state,
                list: state.list.delete(action.token.address())
            };
        case TOKENS_ERROR:
            return {
                ...state,
                error: action.address
            };
        case TOKENS_HIDE_ERROR:
            return {
                ...state,
                error: false
            };
        default:
            return state;
    }
};

const showTokenError = (address: string) => ({type: TOKENS_ERROR, address});
const hideTokenError = () => ({type: TOKENS_HIDE_ERROR});

const listTokens = () => (dispatch) => {
    return AppDAO.getTokenContracts().then(list => {
        dispatch({type: TOKENS_LIST, list});
    });
};

const listTokenBalances = (token: TokenContractModel, page = 0, address = null) => (dispatch) => {
    let balances = new Map();
    balances = balances.set('Loading...', null);
    dispatch({type: TOKENS_BALANCES, balances});

    return new Promise(resolve => {
        if (address === null) {
            let perPage = 100;
            PlatformDAO.getHoldersCount().then(balancesNum => {
                dispatch({type: TOKENS_BALANCES_NUM, num: balancesNum, pages: Math.ceil(balancesNum / perPage)});
                AppDAO.getTokenBalances(token.symbol(), page * perPage, perPage).then(balances => {
                    dispatch({type: TOKENS_BALANCES, balances});
                    resolve();
                });
            });
        } else {
            dispatch({type: TOKENS_BALANCES_NUM, num: 1, pages: 1});
            balances = new Map();
            if (isEthAddress(address)) {
                token.proxy().then(proxy => {
                    proxy.getAccountBalance(address).then(balance => {
                        balances = balances.set(address, balance.toNumber());
                        dispatch({type: TOKENS_BALANCES, balances});
                        resolve();
                    });
                });
            } else {
                dispatch({type: TOKENS_BALANCES, balances});
                resolve();
            }
        }
    });
};

const viewToken = (token: TokenContractModel) => (dispatch) => {
    return token.proxy().then(proxy => {
        return proxy.totalSupply().then(supply => {
            token = token.set('totalSupply', supply);
            dispatch({type: TOKENS_VIEW, token});
            dispatch(showSettingsTokenViewModal());
            dispatch(listTokenBalances(token));
        });
    }, () => dispatch(showTokenError(token.address())));
};

const formToken = (token: TokenContractModel) => (dispatch) => {
    dispatch({type: TOKENS_FORM, token});
    dispatch(showSettingsTokenModal());
};

const treatToken = (current: TokenContractModel, newAddress: string, account) => (dispatch) => {
    return AppDAO.treatToken(current, newAddress, account).then(result => {
        if (!result) { // success result will be watched so we need to process only false
            dispatch(showTokenError(newAddress));
        }
    });
};

const watchUpdateToken = (token: TokenContractModel, time, revoke) => (dispatch) => {
    dispatch(notify(new TokenContractNoticeModel({time, token, revoke})));
    dispatch({type: revoke ? TOKENS_REMOVE : TOKENS_UPDATE, token});
};

export {
    listTokens,
    viewToken,
    listTokenBalances,
    formToken,
    treatToken,
    watchUpdateToken,
    showTokenError,
    hideTokenError
}

export default reducer;
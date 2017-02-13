import TimeProxyDAO from '../../../dao/TimeProxyDAO';
import LHTProxyDAO from '../../../dao/LHTProxyDAO';

// Constants
const SET_TIME_BALANCE_START = 'wallet/SET_TIME_BALANCE_START';
const SET_TIME_BALANCE_SUCCESS = 'wallet/SET_TIME_BALANCE_SUCCESS';

const SET_LHT_BALANCE_START = 'wallet/SET_LHT_BALANCE_START';
const SET_LHT_BALANCE_SUCCESS = 'wallet/SET_LHT_BALANCE_SUCCESS';

const SET_ETH_BALANCE_START = 'wallet/SET_ETH_BALANCE_START';
const SET_ETH_BALANCE_SUCCESS = 'wallet/SET_ETH_BALANCE_SUCCESS';

// Reducer
const initialState = {
    time: {
        balance: null,
        isFetching: true
    },
    lht: {
        balance: null,
        isFetching: true
    },
    eth: {
        balance: null,
        isFetching: true
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIME_BALANCE_START:
            return {
                ...state,
                time: {
                    ...state.time,
                    isFetching: true
                }
            };
        case SET_TIME_BALANCE_SUCCESS:
            return {
                ...state,
                time: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        case SET_LHT_BALANCE_START:
            return {
                ...state,
                lht: {
                    ...state.lht,
                    isFetching: true
                }
            };
        case SET_LHT_BALANCE_SUCCESS:
            return {
                ...state,
                lht: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        case SET_ETH_BALANCE_START:
            return {
                ...state,
                eth: {
                    ...state.eth,
                    isFetching: true
                }
            };
        case SET_ETH_BALANCE_SUCCESS:
            return {
                ...state,
                eth: {
                    isFetching: false,
                    balance: action.payload
                }
            };
        default:
            return state
    }
};

const setTimeBalanceStart = () => ({type: SET_TIME_BALANCE_START});
const setTimeBalanceSuccess = (payload) => ({type: SET_TIME_BALANCE_SUCCESS, payload});

const setLHTBalanceStart = () => ({type: SET_LHT_BALANCE_START});
const setLHTBalanceSuccess = (payload) => ({type: SET_LHT_BALANCE_SUCCESS, payload});

const setETHBalanceStart = () => ({type: SET_ETH_BALANCE_START});
const setETHBalanceSuccess = (payload) => ({type: SET_ETH_BALANCE_SUCCESS, payload});

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

export {
    updateTimeBalance,
    updateLHTBalance,
    updateETHBalance,
    transferEth,
    transferLht,
    transferTime
}

export default reducer;
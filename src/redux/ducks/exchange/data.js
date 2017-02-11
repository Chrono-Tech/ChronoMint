import {Map} from 'immutable';
import AssetModel from '../../../models/AssetModel.js'
import ExchangeDAO from '../../../dao/ExchangeDAO';

export const EXCHANGE_RATES_LOAD_START = 'exchange/RATES_LOAD_START';
export const EXCHANGE_RATES_LOAD_SUCCESS = 'exchange/RATES_LOAD_SUCCESS';

const initialState = new Map;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EXCHANGE_RATES_LOAD_SUCCESS:
            return state.set(action.payload.title, new AssetModel(action.payload));
        default:
            return state;
    }
};

const setRatesStart = () => ({type: EXCHANGE_RATES_LOAD_START});
const setRatesSuccess = (payload) => ({type: EXCHANGE_RATES_LOAD_SUCCESS, payload});

export const getRates = () => (dispatch) => {
    dispatch(setRatesStart());
    Promise.all([
        ExchangeDAO.getBuyPrice(),
        ExchangeDAO.getSellPrice()
    ]).then(values => {
        dispatch(setRatesSuccess({
            title: 'LHT',
            buyPrice: ExchangeDAO.web3.fromWei(values[0].toNumber(), 'ether'),
            sellPrice: ExchangeDAO.web3.fromWei(values[1].toNumber(), 'ether')
        }))
    });
};


export default reducer;
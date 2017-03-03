import {Map} from 'immutable';
import AssetModel from '../../../models/AssetModel.js'

export const EXCHANGE_RATES_LOAD_START = 'exchange/RATES_LOAD_START';
export const EXCHANGE_RATES_LOAD_SUCCESS = 'exchange/RATES_LOAD_SUCCESS';
export const setRatesStart = () => ({type: EXCHANGE_RATES_LOAD_START});
export const setRatesSuccess = (payload) => ({type: EXCHANGE_RATES_LOAD_SUCCESS, payload});

const initialState = new Map();

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EXCHANGE_RATES_LOAD_SUCCESS:
            return state.set(action.payload.title, new AssetModel(action.payload));
        default:
            return state;
    }
};

export default reducer;
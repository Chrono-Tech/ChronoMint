import {Map} from 'immutable';
import AssetModel from '../../models/AssetModel.js'
import ExchangeDAO from '../../dao/ExchangeDAO';

const EXCHANGE_RATES_LOAD = 'exchange/RATES_LOAD';

const initialState = new Map([
    ['LHT', new AssetModel()]
]);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EXCHANGE_RATES_LOAD:
            return state.set(action.payload.title, new AssetModel(action.payload));
        default:
            return state;
    }
};

const setRates = (payload) => ({type: EXCHANGE_RATES_LOAD, payload});

export const getRates = () => (dispatch) => {
    Promise.all([
        ExchangeDAO.getBuyPrice(),
        ExchangeDAO.getSellPrice()
    ]).then(values => {
        dispatch(setRates({
            title: 'LHT',
            buyPrice: ExchangeDAO.web3.fromWei(values[0].toNumber(), 'ether'),
            sellPrice: ExchangeDAO.web3.fromWei(values[1].toNumber(), 'ether')
        }))
    });
};


export default reducer;
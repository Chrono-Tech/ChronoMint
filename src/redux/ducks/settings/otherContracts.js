import {Map} from 'immutable';
import ContractModel from '../../../models/ContractModel';
import RewardsDAO from '../../../dao/RewardsDAO';
import ExchangeDAO from '../../../dao/ExchangeDAO';

const OTHER_CONTRACTS_LIST = 'settings/OTHER_CONTRACTS_LIST';

const initialState = {
    list: new Map
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case OTHER_CONTRACTS_LIST:
            return {
                ...state,
                list: action.list
            };
        default:
            return state;
    }
};

const listContracts = () => (dispatch) => {
    // TODO Code below is temporary and will be refactored when ChronoMint contract will allow to get contracts list
    RewardsDAO.getAddress().then(rewardsAddress => {
        ExchangeDAO.getAddress().then(exchangeAddress => {
            var list = new Map;
            list = list.set(0, new ContractModel({address: rewardsAddress, name: 'Rewards'}));
            list = list.set(1, new ContractModel({address: exchangeAddress, name: 'Exchanges'}));
            dispatch({type: OTHER_CONTRACTS_LIST, list});
        });
    });
};

export {
    listContracts
}

export default reducer;
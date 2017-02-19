import {Map} from 'immutable';
import ContractModel from '../../../models/ContractModel';

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
    var list = new Map;
    list = list.set(0, new ContractModel({address: '0x01', name: 'Rewards'}));
    list = list.set(1, new ContractModel({address: '0x02', name: 'Exchanges'}));
    dispatch({type: OTHER_CONTRACTS_LIST, list});
};

export {
    listContracts
}

export default reducer;
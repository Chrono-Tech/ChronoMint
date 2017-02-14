import {Map} from 'immutable';
import TokenModel from '../../../models/TokenModel';
//import {showSettingsTokensModal} from '../../../redux/ducks/ui/modal';

const TOKENS_LIST = 'settings/TOKENS_LIST';

const initialState = {
    list: new Map,
    form: new TokenModel
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKENS_LIST:
            return {
                ...state,
                list: action.list
            };
        default:
            return state;
    }
};

const listTokens = () => (dispatch) => {
    let tokens = new Map;
    tokens = tokens.set(0, new TokenModel({name: 'TIME', address: '0xbaf03a294b7c46e1634e341925b087f2522e4765'}));
    tokens = tokens.set(1, new TokenModel({name: 'LHT', address: '0x7de50e8f8187ed4ac05b30efdfa1e2a07c00f2de'}));
    dispatch({type: TOKENS_LIST, list: tokens});
};

export {
    listTokens
}

export default reducer;
import * as a from './actions';
import AbstractContractDAO from '../../dao/AbstractContractDAO';
import UserModel from '../../models/UserModel';

const initialState = {
    account: null,
    profile: new UserModel(),
    isCBE: false,
    isFetching: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case a.SESSION_CREATE_START:
            return {
                ...state,
                isFetching: true
            };
        case a.SESSION_CREATE_SUCCESS:
            const {account, isCBE} = action;
            localStorage.setItem('chronoBankAccount', account);
            return {
                ...state,
                account,
                isCBE,
                isFetching: false
            };
        case a.SESSION_PROFILE:
            return {
                ...state,
                profile: action.profile
            };
        case a.SESSION_DESTROY:
            localStorage.clear();
            localStorage.setItem('next', action.next);
            AbstractContractDAO.stopWatching();

            // TODO MINT-94 reset all redux state

            // TODO When all contracts event watchers will be initialized through the...
            /** @see AbstractContractDAO._watch TODO ...remove line below */
            window.location.reload(); // to stop watch all events

            return initialState;
        default:
            return state;
    }
};
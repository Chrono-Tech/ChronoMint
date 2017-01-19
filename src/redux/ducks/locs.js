import {browserHistory} from 'react-router';

import App from '../../app';
import LOC from 'contracts/LOC.sol';

const LOC_CREATE = 'loc/CREATE';
const LOC_APPROVE = 'loc/APPROVE';
const LOC_EDIT = 'loc/EDIT';

const initialState = {
    items: [
        {id: 1, name: 'Wieden+Kennedy', price: '5000 LHAU', category: 'Marketing', isPending: true },
        {id: 2, name: 'Renaissance Construction', price: '7000 LHAU', category: 'Construction'},
        {id: 3, name: 'Wallmart', price: '15000 LHAU', category: 'Sales'},
        {id: 4, name: 'IBM', price: '3000 LHAU', category: 'IT'},
        {id: 5, name: 'International Cleaning Services', price: '45000 LHAU', category: 'Cleaning'},
        {id: 6, name: 'LOC 6', price: '20000 LHAU', category: 'Category 6'},
        {id: 7, name: 'LOC 7', price: '97000 LHAU', category: 'Category 7'},
        {id: 8, name: 'LOC 8', price: '20000 LHAU', category: 'Category 8'}
    ]
};

const createLOC = (payload) => ({type: LOC_CREATE, payload});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_CREATE:
            if (!state.addresses[action.address]) {
            return {
                ...state,
                addresses: {
                    ...state.addresses,
                    [action.address]: action.address
                }
            };
        }
        case LOC_APPROVE:
            localStorage.removeItem('chronoBankAccount');
            return initialState;
        case LOC_EDIT:
            localStorage.removeItem('chronoBankAccount');
            return initialState;
        default:
            return state;
    }
};

const proposeLOC = (data, callback) => (dispatch) => {
    App.chronoMint.proposeLOC(data, {from: account})
        .then(r => {
            if (r) {
                dispatch(createLOC(data));
                callback.call();
            }
        })
        .catch(error => console.error(error));
};

export {
    proposeLOC
}

export default reducer;
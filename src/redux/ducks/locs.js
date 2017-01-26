import {browserHistory} from 'react-router';

import App from '../../app';
import LOC from 'contracts/LOC.sol';

const LOC_CREATE = 'loc/CREATE';
const LOC_APPROVE = 'loc/APPROVE';
const LOC_EDIT = 'loc/EDIT';
const LOC_LIST = 'loc/LIST';

const initialState = {
    items: [
        {id: 1, name: 'Wieden+Kennedy', issueLimit: '5000 LHAU', expDate: '42534', isPending: true },
        {id: 2, name: 'Renaissance Construction', issueLimit: '7000 LHAU', expDate: '4242'},
        {id: 3, name: 'Wallmart', issueLimit: '15000 LHAU', expDate: '4214'},
        {id: 4, name: 'IBM', issueLimit: '3000 LHAU', expDate: '41214'},
        {id: 5, name: 'International Cleaning Services', issueLimit: '45000 LHAU', expDate: '41214'},
        {id: 6, name: 'LOC 6', issueLimit: '20000 LHAU', expDate: '424114'},
        {id: 7, name: 'LOC 7', issueLimit: '97000 LHAU', expDate: '24414'},
        {id: 8, name: 'LOC 8', issueLimit: '20000 LHAU', expDate: '424214'}
    ]
};

const createLOC = (data) => ({type: LOC_CREATE, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_CREATE:
            // if (!state.addresses[action.address]) {
            return {
                ...state,
                items: [
                    ...state.items,
                    {id: state.items.length + 1, ...action.data}
                ]
            };
        // }
        case LOC_APPROVE:
            localStorage.removeItem('chronoBankAccount');
            return initialState;
        case LOC_EDIT:
        localStorage.removeItem('chronoBankAccount');
        return initialState;
        case LOC_LIST:
            localStorage.removeItem('chronoBankAccount');
            return initialState;
        default:
            return state;
    }
};

const proposeLOC = (data, callback, dispatch) => {
    App.chronoMint.proposeLOC.call(
        data['name'],
        data['account'],
        data['issueLimit'],
        data['uploadedFileHash'],
        data['expDate'], {
            from: data['account'],
            gas: 3000000
        })
        .then(address => {
            debugger;
            if (address) {
                dispatch(createLOC({...data, address}));
                getLOCS(data['account'], App.chronoMint, (r)=>{
                    console.log(r);
                });
                callback.call();
            }
        })
        .catch(error => console.error(error));
};

const getLOCS = (account, chronoMint, callback) => {
    chronoMint.getLOCCount.call({from: account})
        .then(r => {
            if(r) {
                for(let i = 0; i <= r.toNumber(); i++) {
                    debugger;
                    return;
                    App.chronoMint.getLOCbyID(i, {from: chronoMint.address}).then( r => {
                        debugger;
                        var loc = LOC.at(r);
                        console.log(loc);
                    })
                }
            }
            callback.call(100500);
        });
};

export {
    proposeLOC,
    getLOCS
}

export default reducer;
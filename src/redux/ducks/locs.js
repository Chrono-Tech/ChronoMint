import App from '../../app';
import LOC from 'contracts/LOC.sol';
import truffleConfig from '../../../truffle.js'
import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';
import {store} from 'redux/configureStore';

const LOC_CREATE = 'loc/CREATE';
const LOC_APPROVE = 'loc/APPROVE';
const LOC_EDIT = 'loc/EDIT';
const LOC_LIST = 'loc/LIST';

const hostname = (truffleConfig.rpc.host === '0.0.0.0') ? window.location.hostname : truffleConfig.rpc.host;
const web3Location = `http://${hostname}:${truffleConfig.rpc.port}`;
const web3 = typeof web3 !== 'undefined' ?
    new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

ChronoMint.setProvider(web3.currentProvider);
LOC.setProvider(web3.currentProvider);

const getLOCS = (account, chronoMint, callback) => {
    chronoMint.getLOCCount.call({from: account})
        .then(r => {
            if(r) {
                for(let i = 0; i < r.toNumber(); i++) {
                    chronoMint.getLOCbyID.call(i, {from: account}).then( (r) => {
                        const loc = LOC.at(r);
                        callback(loc);
                    })
                }
            }
        });
};

getLOCS(localStorage.chronoBankAccount, ChronoMint.deployed(), (loc)=>{
    const account = localStorage.chronoBankAccount;
    const callback = (valueName, value)=>{
        store.dispatch(editLOC({[valueName]: value, address: loc.address}));

    };
    loc.getName({from: account}).then( callback.bind(null, 'name'));
    loc.getValue(4, {from: account}).then( callback.bind(null, 'issueLimit') );
    loc.getValue(7, {from: account}).then( callback.bind(null, 'publishedHash') );
    loc.getValue(8, {from: account}).then( callback.bind(null, 'expDate') );
});

const initialState = {
    items: [
        {id: 1, name: 'Wieden+Kennedy___', issueLimit: '5000 LHAU', expDate: '1488657816829', isPending: true },
        {id: 2, name: 'Renaissance Construction', issueLimit: '7000 LHAU', expDate: '1485583345349'},
        {id: 3, name: 'Wallmart', issueLimit: '15000 LHAU', expDate: '1485583135399'},
        {id: 4, name: 'IBM', issueLimit: '3000 LHAU', expDate: '1496754335699'},
        {id: 5, name: 'International Cleaning Services', issueLimit: '45000 LHAU', expDate: '1485586585753'}
    ]
};

const createLOC = (data) => ({type: LOC_CREATE, data});
const editLOC = (data) => ({type: LOC_EDIT, data});

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
            return initialState;
        case LOC_EDIT:
            //if (state.items.some(item => item.address == action.address)){
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].address == action.data.address){
                    let newState = {...state};
                    let item = newState.items[i];
                    for(let prop in action.data) {
                        if (action.data.hasOwnProperty(prop)) {
                            item[prop] = action.data[prop];
                        }
                    }
                    return newState;
                }
            }
            return {
                ...state,
                items: [
                    ...state.items,
                    {id: state.items.length + 1, ...action.data}
                ]
            };
        case LOC_LIST:
            return initialState;
        default:
            return state;
    }
};

const proposeLOC = (data, callback, dispatch) => {
    App.chronoMint.proposeLOC/*.call*/(
        data['name'],
        data['account'],
        data['issueLimit'],
        data['uploadedFileHash'],
        data['expDate'], {
            from: data['account'],
            gas: 3000000
        })
        .then( address => {// not address
            if (address) {
                dispatch(createLOC({...data, address}));
            }
        })
        .catch(error => console.error(error));
};

export {
    proposeLOC,
    getLOCS
}

export default reducer;
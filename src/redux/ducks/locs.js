import App from '../../app';
import LOC from 'contracts/LOC.sol';
import truffleConfig from '../../../truffle.js'
import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';
import {store} from 'redux/configureStore';

import LocDAO from '../../dao/LocDAO';
import AppDAO from '../../dao/AppDAO';

const LOC_CREATE = 'loc/CREATE';
const LOC_APPROVE = 'loc/APPROVE';
const LOC_EDIT = 'loc/EDIT';
const LOC_LIST = 'loc/LIST';
const LOC_REMOVE = 'loc/REMOVE';

const Setting = {name: 0, website: 1, issueLimit: 3, publishedHash: 6, expDate: 7};
const SettingString = {name: 0, website: 1, publishedHash: 6};

const hostname = (truffleConfig.rpc.host === '0.0.0.0') ? window.location.hostname : truffleConfig.rpc.host;
const web3Location = `http://${hostname}:${truffleConfig.rpc.port}`;
const web3 = typeof web3 !== 'undefined' ?
    new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

ChronoMint.setProvider(web3.currentProvider);
LOC.setProvider(web3.currentProvider);

const loadLOCPropsToStore = (address) => {
    const loc = new LocDAO(address).contract;
    const account = localStorage.getItem('chronoBankAccount');

    const callback = (valueName, value)=>{
        store.dispatch(editLOCAction({[valueName]: value, address}));
    };

    for(let setting in Setting){
        let operation;
        if (setting in SettingString) {
            operation = loc.getString;
        } else {
            operation = loc.getValue;
        }
        operation(Setting[setting], {from: account}).then( callback.bind(null, setting) );
    }
};

const newLOCCallback = (e, r) => {
    loadLOCPropsToStore(r.args._LOC);
};

AppDAO.chronoMint.newLOC().watch(newLOCCallback);

const getLOCS = (account, chronoMint, loadLOCPropsToStore_) => {
    AppDAO.getLOCCount(account)
        .then(r => {
            if(r) {
                for(let i = 0; i < r.toNumber(); i++) {
                    AppDAO.getLOCbyID(i, address).then( (r) => {
                        loadLOCPropsToStore_(r);
                    })
                }
            }
        });
};

getLOCS(localStorage.getItem('chronoBankAccount'), AppDAO.chronoMint, loadLOCPropsToStore);

const initialState = {
    items: [
        {id: 1000050000, name: 'Fat Dog Brewery', issueLimit: '25000', expDate: '1488657816829', isPending: true },
        // {id: 1, name: 'Renaissance Construction', issueLimit: '7000', expDate: '1485583345349'},
        // {id: 2, name: 'Wallmart', issueLimit: '15000', expDate: '1485583135399'},
        // {id: 3, name: 'IBM', issueLimit: '3000', expDate: '1496754335699'},
        // {id: 4, name: 'International Cleaning Services', issueLimit: '45000', expDate: '1485586585753'}
    ]
};

// const createLOC = (data) => ({type: LOC_CREATE, data});
const editLOCAction = (data) => ({type: LOC_EDIT, data});
const removeLOCAction = (data) => ({type: LOC_REMOVE, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOC_CREATE:
            // if (!state.addresses[action.address]) {
            return {
                ...state,
                items: [
                    ...state.items,
                    {id: state.items.length, ...action.data}
                ]
            };
        // }
        case LOC_APPROVE:
            return initialState;
        case LOC_REMOVE:
            return state.items.filter( (item)=> item.address != action.address );
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
                    {id: state.items.length, ...action.data}
                ]
            };
        case LOC_LIST:
            return initialState;
        default:
            return state;
    }
};

const editLOC = (data) => {
    let address = data['address'];
    let account = data['account'];

    const callback = (valueName, value)=>{
        store.dispatch(editLOCAction({[valueName]: value, address}));
    };

    for(let settingName in Setting){
        if(data.values.get(settingName) === undefined) continue;
        let value = data.values.get(settingName).toString();
        let settingIndex = Setting[settingName];
        let operation;
        if (settingName in SettingString) {
            operation = AppDAO.chronoMint.setLOCString;
        } else {
            operation = AppDAO.chronoMint.setLOCValue;
        }
        operation(address, settingIndex, value, {
            from: account,
            gas: 3000000
        }).then(
            () => callback(settingName, value)
        );
    }
};

const proposeLOC = (props) => {
    AppDAO.chronoMint.proposeLOC(props,
        {
            from: props['account'],
            gas: 3000000
        }
    ).catch(error => console.error(error));
};

const removeLOC = (data) => {
    let address = data['address'];
    AppDAO.chronoMint.removeLOC(
        address,
        {
            from: localStorage.getItem('chronoBankAccount'),
            gas: 3000000
        }
    ).then(
        () => store.dispatch(removeLOCAction({address}))
    )
};

export {
    proposeLOC,
    getLOCS,
    editLOC,
    removeLOC,
}

export default reducer;
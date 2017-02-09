import App from '../../app';
import truffleConfig from '../../../truffle.js'
import ChronoMint from 'contracts/ChronoMint.sol';
import Web3 from 'web3';
import {store} from '../configureStore';

const PENDING_EDIT = 'pending/EDIT';
const PENDING_EDIT_PROPS = 'pending/EDIT_PROPS';
const PENDING_REVOKE = 'pending/REVOKE';
const PENDING_CONFIRM = 'pending/CONFIRM';

const {networks: {development: {host, port}}} = truffleConfig;
const hostname = (host === '0.0.0.0') ? window.location.hostname : host;
const web3Location = `http://${hostname}:${port}`;
const web3 = typeof web3 !== 'undefined' ?
    new Web3(web3.currentProvider) : new Web3(new Web3.providers.HttpProvider(web3Location));

ChronoMint.setProvider(web3.currentProvider);

const initialState = {
    items:[
        {id: 0, type: 1, conf_sign: '111111111111111111111111', needed: 2, hasConfirmed: true },
        {id: 1, type: 1, conf_sign: '222222222222222222222222', needed: 1, hasConfirmed: false },
    ],
    props:{
        signaturesRequired:18,
    }
};

const editPendingAction = (data) => ({type: PENDING_EDIT, data});

const editPendingPropsAction = (data) => ({type: PENDING_EDIT_PROPS, data});

const revokeAction = (data) => ({type: PENDING_REVOKE, data});

const confirmAction = (data) => ({type: PENDING_CONFIRM, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING_EDIT:
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].conf_sign == action.data.conf_sign){
                    let newState = {...state};
                    let item = newState.items[i];
                    newState.items[i] = {...item, ...action.data};
                    return newState;
                }
            }
            return {
                ...state,
                items:[
                    ...state.items,
                    {id: state.items.length, ...action.data}
                ]
            };
        case PENDING_EDIT_PROPS:
            return {
                ...state,
                props: {
                    ...state.props,
                    ...action.data
                }
            };
        case PENDING_REVOKE:
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].conf_sign == action.data.conf_sign){
                    let newState = {...state};
                    let item = newState.items[i];
                    newState.items[i] = {...item, needed: +item.needed + 1, hasConfirmed: false};
                    return newState;
                }
            }
            return state;
        case PENDING_CONFIRM:
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].conf_sign == action.data.conf_sign){
                    let newState = {...state};
                    let item = newState.items[i];
                    newState.items[i] = {...item, needed: +item.needed - 1, hasConfirmed: true};
                    return newState;
                }
            }
            return state;
        default:
            return state;
    }
};

const loadPendingPropsToStore = (conf_sign, chronoMint)=>{
    const account = localStorage.chronoBankAccount;
    const callback = (value)=>{
        store.dispatch(editPendingAction({...value, conf_sign}));
    };

    callback({conf_sign});

    chronoMint.getTxsType.call(conf_sign, {from: account}).then( type=>callback( {type}) );

    chronoMint.pendingYetNeeded.call(conf_sign, {from: account}).then( needed=>callback({needed}) );

    chronoMint.hasConfirmed.call(conf_sign, account, {from: account}).then( hasConfirmed=>callback({hasConfirmed}) );
};

const getPendings = (account, chronoMint, loadPropsToStore_) => {
    chronoMint.required.call({from: account})
        .then(signaturesRequired => {
            store.dispatch(editPendingPropsAction({signaturesRequired}));
        });
    chronoMint.pendingsCount.call({from: account})
        .then(count => {
            for(let i = 0; i < count.toNumber(); i++) {
                chronoMint.pendingById.call(i, {from: account}).then( (conf_sign) => {
                    loadPropsToStore_(conf_sign, chronoMint);
                })
            }
        });
};

getPendings(localStorage.chronoBankAccount, ChronoMint.deployed(), loadPendingPropsToStore);

const revoke = (data) => {
    let conf_sign = data['conf_sign'];
    App.chronoMint.revoke(conf_sign, {from: localStorage.chronoBankAccount}).then(
        ()=>store.dispatch(revokeAction({conf_sign}))
    )
};

const confirm = (data) => {
    let conf_sign = data['conf_sign'];
    App.chronoMint.confirm(conf_sign, {from: localStorage.chronoBankAccount}).then(
        ()=>store.dispatch(confirmAction({conf_sign}))
    )
};

export {
    getPendings,
    revoke,
    confirm
}

export default reducer;
import {store} from '../../redux/configureStore';
import LocDAO from '../../dao/LocDAO';
import AppDAO from '../../dao/AppDAO';
import {locsData as initialState} from './locs/';

const LOC_CREATE = 'loc/CREATE';
const LOC_APPROVE = 'loc/APPROVE';
const LOC_EDIT = 'loc/EDIT';
const LOC_LIST = 'loc/LIST';
const LOC_REMOVE = 'loc/REMOVE';

const Setting = {LOCName: 0, website: 1, issueLimit: 3, publishedHash: 6, expDate: 7};
const SettingString = {LOCName: 0, website: 1, publishedHash: 6};
//const Status = {maintenance:0, active:1, suspended:2, bankrupt:3};

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
            return {
                ...state,
                items: state.items.filter( (item)=> item.address !== action.data.address )
            };
        case LOC_EDIT:
            //if (state.items.some(item => item.address === action.address)){
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].address === action.data.address){
                    let newState = {...state};
                    let item = newState.items[i];
                    newState.items[i] = {...item, ...action.data};
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

const editLOCAction = (data) => ({type: LOC_EDIT, data});

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

const getLOCs = (account, loadLOCPropsToStore_) => {
    AppDAO.getLOCs.call({from: account})
        .then( r => r.forEach(loadLOCPropsToStore_) );
};

//const createLOC = (data) => ({type: LOC_CREATE, data});
const removeLOCAction = (data) => ({type: LOC_REMOVE, data});

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
            operation = AppDAO.setLOCString;
        } else {
            operation = AppDAO.setLOCValue;
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
    let {LOCName, website, issueLimit, publishedHash, expDate, account} = props;
    expDate = +expDate;
    AppDAO.proposeLOC(LOCName, website, issueLimit, publishedHash, expDate, account)
        .catch(error => console.error(error));
};

const removeLOC = (data) => {
    let address = data['address'];
    AppDAO.removeLOC(address, localStorage.getItem('chronoBankAccount'))
        .then(() => store.dispatch(removeLOCAction({address})));
};

AppDAO.newLOCWatch(newLOCCallback);

getLOCs(localStorage.getItem('chronoBankAccount'), loadLOCPropsToStore);

export {
    proposeLOC,
    getLOCs,
    editLOC,
    removeLOC,
}

export default reducer;
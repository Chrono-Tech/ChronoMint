import {store} from '../../configureStore';

// import LocDAO from '../../dao/LocDAO';
import AppDAO from '../../../dao/AppDAO';

const PENDING_EDIT = 'pending/EDIT';
const PENDING_EDIT_PROPS = 'pending/EDIT_PROPS';
const PENDING_REVOKE = 'pending/REVOKE';
const PENDING_CONFIRM = 'pending/CONFIRM';

const initialState = {
    items:[
        {id: 0, type: 1, conf_sign: '111111111111111111111111', needed: 2, hasConfirmed: true },
        {id: 1, type: 1, conf_sign: '222222222222222222222222', needed: 3, hasConfirmed: false },
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
                if (state.items[i].conf_sign === action.data.conf_sign){
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
                if (state.items[i].conf_sign === action.data.conf_sign){
                    let newState = {...state};
                    let item = newState.items[i];
                    newState.items[i] = {...item, needed: +item.needed + 1, hasConfirmed: false};
                    return newState;
                }
            }
            return state;
        case PENDING_CONFIRM:
            for(let i=0; i < state.items.length; i++) {
                if (state.items[i].conf_sign === action.data.conf_sign){
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

const account = localStorage.chronoBankAccount;

const loadPendingPropsToStore = (conf_sign)=>{
    const callback = (value)=>{
        store.dispatch(editPendingAction({...value, conf_sign}));
    };

    callback({conf_sign});

    AppDAO.getTxsType(conf_sign, account).then( type=>callback( {type}) );

    AppDAO.pendingYetNeeded(conf_sign, account).then( needed=>callback({needed}) );

    AppDAO.hasConfirmed(conf_sign, account, account).then( hasConfirmed=>callback({hasConfirmed}) );
};

const getPendings = (account, loadPropsToStore_) => {
    AppDAO.required(account)
        .then(signaturesRequired => {
            store.dispatch(editPendingPropsAction({signaturesRequired}));
        });
    AppDAO.pendingsCount(account)
        .then(count => {
            for(let i = 0; i < count.toNumber(); i++) {
                AppDAO.pendingById(i, account).then( (conf_sign) => {
                    loadPropsToStore_(conf_sign);
                })
            }
        });
};

getPendings(account, loadPendingPropsToStore);

const revoke = (data) => {
    let conf_sign = data['conf_sign'];
    AppDAO.revoke(conf_sign, account).then(
        ()=>store.dispatch(revokeAction({conf_sign}))
    )
};

const confirm = (data) => {
    let conf_sign = data['conf_sign'];
    AppDAO.confirm(conf_sign, account).then(
        ()=>store.dispatch(confirmAction({conf_sign}))
    ).catch( //TODO delete it:
        ()=>store.dispatch(confirmAction({conf_sign}))
    )
};

export {
    getPendings,
    revoke,
    confirm,
    reducer
}

export default reducer;
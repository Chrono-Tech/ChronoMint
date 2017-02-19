import {store} from '../../../configureStore';
import initialState from './data';

const PENDING_UPDATE_PROPS = 'pending/UPDATE_PROPS';

const updatePropsAction = (data) => ({type: PENDING_UPDATE_PROPS, data});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING_UPDATE_PROPS:
            return state.set(action.data.valueName, action.data.value);
        default:
            return state;
    }
};

const updatePropsInStore = (valueName, value)=> {
    store.dispatch(updatePropsAction({valueName, value}));
};

export {
    updatePropsInStore,
}

export default reducer;
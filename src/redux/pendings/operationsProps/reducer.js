import Props from '../../../models/OperationsProps'

const initialState = new Props();

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

export {
    updatePropsAction,
}

export default reducer;